import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {PolicyComponent} from '../policy/policy.component';
import {User} from '../../model/User';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User;
  constructor(public dialog: MatDialog, public authService: AuthService, private userService: UserService) {
    this.user = userService.getUser();
  }

  ngOnInit(): void {
  }

  openPolicy(): void {
    this.dialog.open(PolicyComponent);
  }

}
