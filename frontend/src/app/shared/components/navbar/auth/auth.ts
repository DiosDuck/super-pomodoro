import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NAV_AUTH_ITEMS } from '../config';
import { UserService } from '../../../services/user';
import { LoggedInPipe } from '../pipe/user';

@Component({
  selector: 'app-nav-auth',
  templateUrl: './auth.html',
  imports: [RouterLink, LoggedInPipe],
  styleUrl: './auth.scss',
})
export class Auth {
  userService = inject(UserService);
  router = inject(Router);

  user = this.userService.currentUser;
  navItems = NAV_AUTH_ITEMS;

  onLogout(): void
  {
    this.userService.logout();
  }

  saveCurrentUrl(): void
  {
    const url = this.router.url;
    if (url.includes('auth')) {
      return;
    }

    localStorage.setItem('lastUrl', url);
  }
}
