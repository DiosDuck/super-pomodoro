import { Component, inject, signal } from '@angular/core';
import { Menu } from "../menu/menu";
import { Auth } from '../auth/auth';
import { Bubble } from "../bubble/bubble";
import { LastRouteService } from '../../../services/last-route';
import { navId } from '../../navbar.config';

@Component({
  selector: 'app-navbar',
  imports: [Menu, Auth, Bubble],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  lastRouteService = inject(LastRouteService);
  selectedId = signal<navId>(null);

  onSelect(id: navId) {
    this.selectedId.set(id);

    if (id === "nav-auth") {
      this.lastRouteService.updateLastRoute();
    }
  }
}
