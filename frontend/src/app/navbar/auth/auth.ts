import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";
import { NAV_ITEMS } from '../config';
import { UserService } from '../../shared/services/user-service';
import { DialogService } from '../../shared/services/dialog-service';

@Component({
  selector: 'app-nav-auth',
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  userService = inject(UserService);
  dialogService = inject(DialogService);

  currentUser = this.userService.currentUser;
  navItems = NAV_ITEMS;

  constructor(public router: Router) {
  }

  onLogin(): void
  {
    this.userService.login({username: 'username', password: 'password'});
  }

  onRegister(): void
  {
    this.dialogService.open();
  }

  onLogout(): void
  {
    this.userService.logout();
  }
}
