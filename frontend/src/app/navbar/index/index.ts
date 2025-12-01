import { Component, signal } from '@angular/core';
import { navId } from '../config';
import { Menu } from "../menu/menu";
import { Auth } from '../auth/auth';
import { Bubble } from "../bubble/bubble";

@Component({
  selector: 'app-navbar',
  imports: [Menu, Auth, Bubble],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  selectedId = signal<navId>(null);

  onSelect(id: navId) {
    this.selectedId.set(id);
  }
}
