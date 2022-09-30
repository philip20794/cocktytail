import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  constructor(public authService: AuthService) { }

  getErrorMessageEmail(): string {
    if (this.email.hasError('required')) {
      return 'Gib deine E-Mail-Adresse ein';
    }
    return this.email.hasError('email') ? 'Keine gültige E-Mail-Adresse' : '';
  }

  ngOnInit(): void {
  }

}
