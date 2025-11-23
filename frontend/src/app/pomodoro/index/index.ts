import { Component, signal } from '@angular/core';
import { Settings } from '../models/settings';
import { CounterService } from '../services/counter-service';

@Component({
  selector: 'app-pomodoro-index',
  imports: [],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  settings = signal(new Settings);
  counterService: CounterService;

  constructor(
    counterService: CounterService
  ) {
    this.counterService = counterService;
    this.settings.set(counterService.getSettings());
  }
}
