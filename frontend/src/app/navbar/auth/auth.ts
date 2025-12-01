import { Component, input, output, computed, WritableSignal, signal } from '@angular/core';
import { Router } from "@angular/router";
import { NAV_ITEMS, NAV_AUTH_ID, navId } from '../config';
import { UserService } from '../../shared/services/user-service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-nav-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  user: WritableSignal<User|null> = signal(null);
  navItems = NAV_ITEMS;

  constructor(public router: Router, public userService: UserService) {
  }

  onLogin(): void
  {
    this.userService.login({username: 'username', password: 'password'}).then((res) => this.user.set(res));
  }

  onLogout(): void
  {
    this.userService.logout();
    this.user.set(null);
  }
}
