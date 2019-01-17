import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {HttpClient, HttpParams} from '@angular/common/http';
import * as firebase from 'firebase/app';


export interface Credentials {
  _id?: string;
  uid?: string;
  email: string;
  password?: string;
  name?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  readonly authState$: Observable<User | null> = this.fireAuth.authState;
  readonly URL_DB = 'https://api.mlab.com/api/1/databases/users_db/collections/users';
  readonly param = new HttpParams().set('apiKey', 'yBXzBx3_n_T9A-UI3UrM2OKi4YHLPeQN');

  userToDb: Credentials;
  userFromDb: Credentials;
  usersListFromDb: Array<Credentials> = [];

  constructor(private fireAuth: AngularFireAuth, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getUserListFromDb();
  }

  get user(): User | null {
    return this.fireAuth.auth.currentUser;
  }

  login({email, password}: Credentials) {
    this.getUserListFromDb();
    this.userFromDb = this.usersListFromDb.find(o => o.email === email);
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.getUserFromDb(email).subscribe(user => {
          this.userFromDb = user;
        });
        console.log(this.usersListFromDb);
      }).then(() => {
        console.log(this.userFromDb.name);
      }).catch(err => {
        console.log(err);
      });
  }

  loginWithGoogle() {
    this.getUserListFromDb();
    return this.fireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((user) => {
        this.userFromDb = user.user;
        this.saveUserInDb(this.user.email, this.user.displayName, this.user);
      })
      .catch(err => {
        console.log(err);
      });
  }

  register({email, password, name}: Credentials) {
    return this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.saveUserInDb(email, name, user.user);
      });
  }

  getUserFromDb(email: string): Observable<Credentials> {
    const query = {'email': email};
    const userParams = this.param
      .append('q', JSON.stringify(query))
      .append('fo', 'true');
    return this.http.get<Credentials>(this.URL_DB, {params: userParams});
  }

  getUserListFromDb() {
    this.http.get<Array<Credentials>>(this.URL_DB, {params: this.param})
      .subscribe(list => {
        this.usersListFromDb = list;
      });
  }

  saveUserInDb(email: string, name: string, user: User) {
    const uid = user.uid;
    this.userFromDb = {email, name, uid};
    if (!this.usersListFromDb.find(userFromList => userFromList.email === email)) {
      this.userToDb = {email, name, uid};
      this.http.post(this.URL_DB, this.userToDb, {params: this.param})
        .subscribe(userSaved => {
          console.log(userSaved);
          console.log(this.usersListFromDb);
        });
    }

  }

  logout() {
    return this.fireAuth.auth.signOut().then(() => {
      this.userFromDb = null;
      this.userToDb = null;
    });
  }

  resetPassword(credentials: { email: string }) {
    return this.fireAuth.auth.sendPasswordResetEmail(credentials.email);

  }


}
