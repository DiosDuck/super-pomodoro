import { Component } from '@angular/core';
import { Index as Navbar } from "./navbar/index";
import { RouterOutlet } from '@angular/router';
import { Dialog } from "./shared/components/dialog/dialog";

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, Dialog],
  templateUrl: './app.html',
  styleUrl: './app.scss'

})
export class App {
  protected title = 'frontend';
}
