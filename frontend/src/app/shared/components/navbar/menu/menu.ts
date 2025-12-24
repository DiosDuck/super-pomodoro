import { Component, inject, output } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NAV_MENU_ITEMS } from '../../../configs/nav-items';
import { UserService } from '../../../services/user';
import { LoggedInPipe } from '../../../pipe/user';
import { navId } from '../../navbar.config';

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

  onSelect = output<navId>();

  toggle() {
    this.onSelect.emit(null);
  }
}
