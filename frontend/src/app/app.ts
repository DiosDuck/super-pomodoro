import { Component } from '@angular/core';
import { Index as Navbar } from "./navbar/index";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'

})
export class App {
  protected title = 'frontend';
}
