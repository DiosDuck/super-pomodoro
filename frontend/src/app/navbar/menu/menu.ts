import { Component, input, output, computed } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NAV_ITEMS, NAV_MENU_ID, navId } from '../config';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  id : navId = NAV_MENU_ID;
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
