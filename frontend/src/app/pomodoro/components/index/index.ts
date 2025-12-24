import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { StorageService } from '../../pomodoro.services';

@Component({
  selector: 'app-pomodoro-index',
  imports: [],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  storageService = inject(StorageService);
  cycle = signal(this.storageService.getCycle());
  title = computed(
    () => {
      switch (this.cycle().currentCycle) {
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

  timer = signal<number>(0);
  timerStarted = signal<boolean>(false);
  isWaitingFormConfirmation = signal<boolean>(false);
  stopNextTitleButton = computed(() => this.isWaitingFormConfirmation() ? 'Next' : 'Stop');

  onlyStopNextButton() {
    return this.isWaitingFormConfirmation();
  }
}
