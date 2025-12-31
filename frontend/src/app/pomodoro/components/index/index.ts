import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CounterService } from '../../pomodoro.services';
import { RouterLink } from "@angular/router";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pomodoro-index',
  imports: [RouterLink],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index implements OnInit {
  counterService = inject(CounterService);
  title = inject(Title);
  cycle = this.counterService.cycle;
  header = computed(
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

  titleValue = computed(
    () => {
      let start: string;
      if (this.isWaitingFormConfirmation()) {
        start = 'Confirm';
      } else {
        switch (this.cycle().currentCycle) {
          case 'idle':
            return 'Pomodoro';
          case 'work':
            start = 'Work';
            break;
          case 'short-break':
          case 'long-break':
            start = 'Break';
            break;
        }
      }

      return `${start} ${this.minutes()}:${this.seconds()}`;
    }
  );

  ngOnInit(): void 
  {
    this.counterService.remainingSeconds.subscribe((time: number) => {
      this.timer.set(time);
      this.title.setTitle(this.titleValue());
    });
    this.counterService.finish.subscribe(() => {
      if (this.isWaitingFormConfirmation()) {
        this.timerStarted.set(false);
        this.sessionStarted.set(false);
      } else {
        this.alarmClockAudio.load(); 
        this.alarmClockAudio.play();
      }
    })
  }

  async onStart(): Promise<void>
  {
    if (this.sessionStarted()) {
      await this.counterService.pomodoroContinue()
    } else {
      this.sessionStarted.set(true);
      await this.counterService.pomodoroStart()
    }
    this.timerStarted.set(true);
  }

  onStop(): void
  {
    this.timerStarted.set(false);
    this.counterService.pomodoroStop();
  }

  async onNext(): Promise<void>
  {
    this.timerStarted.set(false);
    this.sessionStarted.set(false);
    this.alarmClockAudio.pause();
    await this.counterService.pomodoroNext();
  }

  async onIncrement(count: number): Promise<void>
  {
    await this.counterService.pomodoroIncrement(count);
  }

  async onRewind(): Promise<void>
  {
    this.sessionStarted.set(false);
    this.timerStarted.set(false);
    await this.counterService.pomodoroRewind();
  }

  async onReset(): Promise<void>
  {
    this.sessionStarted.set(false);
    this.timerStarted.set(false);
    await this.counterService.pomodoroReset();
  }
}
