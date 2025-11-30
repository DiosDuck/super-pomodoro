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
  id : navId = NAV_AUTH_ID;
  navItems = NAV_ITEMS;

  currentId = input.required<navId>();
  isSelected = computed<boolean>(() => this.currentId() === this.id);

  onSelect = output<navId>();

  constructor(public router: Router) {
  }

  toggle() {
    let val : navId = this.isSelected() ? null : this.id;
    this.onSelect.emit(val);
  }
}
