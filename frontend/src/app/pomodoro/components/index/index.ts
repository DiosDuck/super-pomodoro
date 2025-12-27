import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CounterService } from '../../pomodoro.services';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-pomodoro-index',
  imports: [RouterLink],
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
  timerStarted = signal<boolean>(false);
  sessionStarted = signal<boolean>(false);
  isWaitingFormConfirmation = this.counterService.waitingConfirmation;
  alarmClockAudio = new Audio('assets/audio/alarm-clock.mp3');

  ngOnInit(): void 
  {
    this.counterService.remainingSeconds.subscribe((time: number) => {
      this.timer.set(time);
    });
    this.counterService.finish.subscribe(() => {
      if (this.isWaitingFormConfirmation()) {
        console.log('Progress lost');
        this.timerStarted.set(false);
        this.sessionStarted.set(false);
      } else {
        console.log('Waitint to continue');
        this.alarmClockAudio = new Audio('assets/audio/alarm-clock.mp3');
        this.alarmClockAudio.play();
      }
    })
  }

  onStart(): void
  {
    if (this.sessionStarted()) {
      this.counterService.pomodoroContinue()
    } else {
      this.sessionStarted.set(true);
      this.counterService.pomodoroStart()
    }
    this.timerStarted.set(true);
  }

  onStop(): void
  {
    this.timerStarted.set(false);
    this.counterService.pomodoroStop();
  }

  onNext(): void
  {
    this.timerStarted.set(false);
    this.sessionStarted.set(false);
    this.alarmClockAudio.pause();
    this.counterService.pomodoroNext();
  }

  onIncrement(count: number): void
  {
    this.counterService.pomodoroIncrement(count);
  }

  onRewind(): void
  {
    this.sessionStarted.set(false);
    this.timerStarted.set(false);
    this.counterService.pomodoroRewind();
  }

  onReset(): void
  {
    this.sessionStarted.set(false);
    this.timerStarted.set(false);
    this.counterService.pomodoroReset();
  }
}
