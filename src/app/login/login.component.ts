import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = {
    email: '',
    password: ''
  };

  registerInfo = '';

  constructor(private router: Router, private authService: AuthService) {
  }

  login() {
    this.authService.login(this.credentials).then(
      () => this.router.navigate(['/dashboard'])
    ).catch(err => console.log(err.message));
  }


  resetPassword() {
    this.authService.resetPassword(this.credentials).then();
  }
}
