import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, Credentials} from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: Credentials;
  image: any;
  isUrl = false;

  constructor(private router: Router, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.user = this.authService.userFromDb;
    this.isItGoogleAccount();
  }

  isItGoogleAccount() {
    this.image = this.authService.userFromDb.picture;
    if (this.authService.user.photoURL && this.authService.user.photoURL.startsWith('https://')) {
      this.isUrl = true;
      this.image = this.authService.user.photoURL;
    }
  }

  logout() {
    this.isUrl = false;
    this.authService.logout()
      .then(() => this.router.navigate(['/login']));
  }


  changePassword() {
    this.authService.changePassword();
  }
}
