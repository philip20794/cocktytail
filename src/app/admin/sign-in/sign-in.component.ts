import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  googleLogoURL = 'https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;
  showLoginContainer = false;
  error = '';
  constructor(public authService: AuthService, public router: Router, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.error = '';
    this.checkLogIn();
    this.matIconRegistry.addSvgIcon(
      'google-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.googleLogoURL)
    );
  }


  refresh(): void {
    location.reload();
  }

  checkLogIn(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['home']);
    } else {
      this.showLoginContainer = true;
    }
  }

  loginClick(): void {
    this.authService.SignIn(this.email.value, this.password.value).then(() => {

    });
  }

  keyPress(event): void {
    if (event.key === 'Enter') {
      this.loginClick();
    }
  }

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

  ngOnInit(): void {
  }

}
