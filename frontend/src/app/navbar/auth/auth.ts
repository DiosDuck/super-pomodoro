import { Component, input, output, computed } from '@angular/core';
import { Router } from "@angular/router";
import { NAV_ITEMS, NAV_AUTH_ID, navId } from '../config';

@Component({
  selector: 'app-nav-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  navItems = NAV_ITEMS;

  constructor(public router: Router) {
  }
}
