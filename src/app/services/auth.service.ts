import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import {AlertService} from './alert.service';
import auth from 'firebase';
import {User} from '../model/User';
import {count, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userState: User;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public db: AngularFireDatabase,
    public alertService: AlertService
  ) {}

  SignIn(email, password): Promise<void> {
    console.log('signIn');
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.loginSuccess(result.user);
        });
      }).catch((error) => {
        this.alertService.error(error.message);
      });
  }

  private loginSuccess(user): void {
    this.SetUserData(user).then((userRef) => {
      if (this.userState) {
        const subscriber = this.afs.collection<User>('users').doc(this.userState.uid).valueChanges().pipe(take(1)).subscribe(value => {
          if (value) {
            const userInCloud: User = JSON.parse(JSON.stringify(value));
            localStorage.setItem('user', JSON.stringify(userInCloud));
            this.router.navigate(['home']);
            subscriber.unsubscribe();
          }
        }, error => {
          this.alertService.error(error);
        });
      }
    });
  }

  SignUp(name, email, password): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SignIn(email, password);
        // this.SetUserData(result.user).then(() => {});
      }).catch((error) => {
        this.alertService.error(error.message);
      });
  }

  SendVerificationMail(): Promise<void> {
    return this.afAuth.currentUser.then(u => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['email-verification']);
      });
  }

  ForgotPassword(passwordResetEmail): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.alertService.success('Password reset E-Mail wurde gesendet');
      }).catch((error) => {
        this.alertService.error(error);
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null);
  }


  GoogleAuth(): Promise<void> {
    return this.AuthLogin(new auth.auth.GoogleAuthProvider());
  }

  FacebookAuth(): Promise<void> {
    return this.AuthLogin(new auth.auth.FacebookAuthProvider());
  }

  AuthLogin(provider): Promise<void> {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.loginSuccess(result.user);
        });
      }).catch((error) => {
        this.alertService.error(error);
      });
  }

  SetUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    this.userState = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    };
    return userRef.set(this.userState, {
      merge: true
    });
  }


  SignOut(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}

