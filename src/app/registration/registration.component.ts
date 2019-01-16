import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {


  credentials = {
    email: '',
    password: '',
    name: '',
    picture: File
  };

  registerInfo = '';
  constructor(private router: Router, private authService: AuthService) { }

  register() {
    this.authService.register(this.credentials)
      .then(() => this.registerInfo = 'account created')
      .catch(err => console.log(err));
  }
}
