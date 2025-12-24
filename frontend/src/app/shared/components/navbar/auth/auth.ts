import { Component, inject, output } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { UserService } from '../../../services/user';
import { LastRouteService } from '../../../services/last-route';
import { navId } from '../../navbar.config';

@Component({
  selector: 'app-nav-auth',
  templateUrl: './auth.html',
  imports: [RouterLink],
  styleUrl: './auth.scss',
})
export class Auth {
  userService = inject(UserService);
  router = inject(Router);
  lastRouteService = inject(LastRouteService);

  user = this.userService.currentUser;

  onSelect = output<navId>();

  async onLogout(): Promise<void>
  {
    this.userService.logout();
    await this.lastRouteService.redirectToLastRoute();
  }

  saveCurrentUrl(): void
  {
    this.lastRouteService.updateLastRoute();
  }

  toggle() {
    this.onSelect.emit(null);
  }
}
