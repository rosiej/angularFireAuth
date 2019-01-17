import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {HttpClient, HttpParams} from '@angular/common/http';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';


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
export class AuthService {

  readonly authState$: Observable<User | null> = this.fireAuth.authState;
  readonly URL_DB = 'https://api.mlab.com/api/1/databases/users_db/collections/users';
  readonly param = new HttpParams().set('apiKey', 'yBXzBx3_n_T9A-UI3UrM2OKi4YHLPeQN');

  userToDb: Credentials;
  userFromDb: Credentials;
  constructor(private fireAuth: AngularFireAuth, private http: HttpClient, private router: Router) {
  }

  get user(): User | null {
    return this.fireAuth.auth.currentUser;
  }

  login({email, password}: Credentials) {
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.getUserFromDb(email).subscribe(user => {
          this.userFromDb = user;
        });
      }).then(() => {
        console.log(this.userFromDb.name);
      }).catch(err => {
        console.log(err);
      });
  }

  loginWithGoogle() {
    return this.fireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.saveUserInDb(this.user.email, this.user.displayName, this.user);
        this.getUserFromDb(this.user.email).subscribe(loggedUser => {
          this.userFromDb = loggedUser;
        });
      }).then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch( err => {
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

  saveUserInDb(email: string, name: string, user: User) {
    const uid = user.uid;
    this.userToDb = {email, name, uid};
    this.http.post(this.URL_DB, this.userToDb, {params: this.param})
      .subscribe(user => {
        console.log(user);
      });
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
