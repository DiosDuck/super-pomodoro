import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NAV_MENU_ITEMS } from '../shared/configs/nav-items';
import { UserService } from '../shared/services/user';
import { LoggedInPipe } from '../shared/pipe/user';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LoggedInPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private _userService = inject(UserService);
  user = this._userService.currentUser;
  navItems = NAV_MENU_ITEMS;
}
