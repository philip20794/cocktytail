import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required]);
  hide = true;
  constructor(public authService: AuthService) { }


  getErrorMessageEmail(): string {
    if (this.email.hasError('required')) {
      return 'Gib deine E-Mail-Adresse ein';
    }
    return this.email.hasError('email') ? 'Keine gültige E-Mail-Adresse' : '';
  }

  getErrorMessagePassword(): string {
    if (this.password.hasError('required')) {
      return 'Gib dein Password ein';
    }
  }

  getErrorMessageName(): string {
    if (this.name.hasError('required')) {
      return 'Darf nicht leer sein';
    }
  }


  ngOnInit(): void {
  }


}
