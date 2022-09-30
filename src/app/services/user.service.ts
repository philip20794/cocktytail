import { Injectable } from '@angular/core';
import {User} from '../model/User';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userRef: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore, private matDialog: MatDialog, private alertService: AlertService) {
    this.getUserRef();
  }


  private getUserRef(): void {
    const storage = localStorage.getItem('user');
    if (storage) {
      const user = JSON.parse(storage);
      this.userRef = this.afs.doc(`users/${user.uid}`);
    }
  }

  public update(user: User): Promise<void> {
    return this.userRef.update(user);
  }

  public save(user: User): void {
    this.update(user).then(() => {
      this.alertService.success('Gespeichert');
      localStorage.setItem('user', JSON.stringify(user));
      this.matDialog.closeAll();
    }).catch(error => {
      this.alertService.error(error);
    });
  }

  public getUser(): User {
    const storage = localStorage.getItem('user');
    if (storage) {
      return JSON.parse(storage);
    } else {
      this.alertService.error('Error loading User');
      return null;
    }
  }

}
