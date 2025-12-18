import { Component, inject, signal } from '@angular/core';
import { navId } from '../config';
import { Menu } from "../menu/menu";
import { Auth } from '../auth/auth';
import { Bubble } from "../bubble/bubble";
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage-service';

@Component({
  selector: 'app-navbar',
  imports: [Menu, Auth, Bubble],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  localStorageService = inject(LocalStorageService);
  router = inject(Router);
  selectedId = signal<navId>(null);

  onSelect(id: navId) {
    this.selectedId.set(id);

    if (id === "nav-auth") {
      this.localStorageService.setLastRoute(this.router.url);
    }
  }
}
