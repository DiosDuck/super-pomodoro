import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NAV_ITEMS } from '../config';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  navItems = NAV_ITEMS;
}
