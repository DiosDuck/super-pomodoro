import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NAV_ITEMS } from '../config';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  navItems = NAV_ITEMS;

  constructor(public router: Router) {
  }
}
