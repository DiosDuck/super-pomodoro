import { Component, computed, inject, signal } from '@angular/core';
import { CounterService } from '../../services/counter-service';

@Component({
  selector: 'app-pomodoro-index',
  imports: [],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  counterService = inject(CounterService);
  settings = signal(this.counterService.getSettings());
  title = computed(
    () => {
      switch (this.settings().currentCycle) {
        case 'idle':
          return 'Welcome to pomodoro!';
        case 'work':
          return 'Let\'s focus now!';
        case 'short-break':
          return 'Take a rest now, you are doing great';
        case 'long-break':
          return 'Tale a longer break, should be proud of yourself now';
      }
    }
  );
}
