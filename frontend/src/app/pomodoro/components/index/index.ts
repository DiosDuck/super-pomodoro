import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CounterService } from '../../pomodoro.services';

@Component({
  selector: 'app-pomodoro-index',
  imports: [],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index implements OnInit {
  counterService = inject(CounterService);
  cycle = this.counterService.cycle;
  title = computed(
    () => {
      if (this.isWaitingFormConfirmation()) {
        return 'Continue?'
      }

      switch (this.cycle().currentCycle) {
        case 'idle':
          return 'Welcome to pomodoro!';
        case 'work':
          return 'Show time!';
        case 'short-break':
          return 'Short break';
        case 'long-break':
          return 'Long break';
      }
    }
  );
  timer = signal<number>(0);
  minutes = computed(() => Math.floor(this.timer() / 60).toString().padStart(2, "0"));
  seconds = computed(() => (this.timer() % 60).toString().padStart(2, "0"));
  timerStarted: boolean = false;
  sessionStarted: boolean = false;
  isWaitingFormConfirmation = this.counterService.waitingConfirmation;
  stopNextTitleButton = computed(() => this.isWaitingFormConfirmation() ? 'Next' : 'Stop');

  ngOnInit(): void 
  { 
    this.counterService.remainingSeconds.subscribe((time: number) => {
      this.timer.set(time);
    });
    this.counterService.finish.subscribe(() => {
      if (this.isWaitingFormConfirmation()) {
        console.log('Progress lost');
      } else {
        console.log('Waitint to continue');
      }
    })
  }

  onlyStopNextButton(): boolean 
  {
    return this.timerStarted;
  }

  onStart(): void
  {
    if (this.sessionStarted) {
      this.counterService.pomodoroContinue()
    } else {
      this.sessionStarted = true;
      this.counterService.pomodoroStart()
    }
    this.timerStarted = true;
  }

  onStop(): void
  {
    this.timerStarted = false;

    if (this.isWaitingFormConfirmation()) {
      this.sessionStarted = false;
      this.counterService.pomodoroNext();
    } else {
      this.counterService.pomodoroStop();
    }
  }

  onRewind(): void
  {
    this.sessionStarted = false;
    this.timerStarted = false;
    this.counterService.pomodoroRewind();
  }

  onReset(): void
  {
    this.sessionStarted = false;
    this.timerStarted = false;
    this.counterService.pomodoroReset();
  }
}
