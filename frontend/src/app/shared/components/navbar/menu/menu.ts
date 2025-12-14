import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NAV_MENU_ITEMS } from '../config';
import { UserService } from '../../../services/user-service';
import { LoggedInPipe } from '../pipe/user';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink, LoggedInPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  navItems = NAV_MENU_ITEMS;
  
  userService = inject(UserService);
  user = this.userService.currentUser;

  router = inject(Router);
}
