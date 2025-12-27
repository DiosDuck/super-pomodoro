import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage';
import { Cycle, Settings } from './pomodoro.model';
import { BehaviorSubject, interval, Observable, Subject, takeUntil, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _localStorageService = inject(LocalStorageService);
  private readonly _settingsKey = 'pomodoro.settings';
  private readonly _cycleKey = 'pomodoro.cycle';

  public setSettings(settings: Settings): void
  {
    this._localStorageService.parseAndSet(
      this._settingsKey, 
      settings
    );
  }

  public getSettings(): Settings
  {
    let data = this._localStorageService.getJsonParsed(this._settingsKey);
    if (data !== null && 'type' in data && data.type === this._settingsKey) {
      return data;
    }

    return this.createNewSetting();
  }

  public setCycle(cycle: Cycle): void
  {
    this._localStorageService.parseAndSet(
      this._cycleKey,
      cycle
    );
  }

  public getCycle(): Cycle
  {
    let data = this._localStorageService.getJsonParsed(this._cycleKey);
    if (data !== null && 'type' in data && data.type === this._cycleKey) {
      let convertedData: Cycle = {
        ...data,
        dateTime: new Date(data.dateTime),
      };
      
      if (this.isValidCycle(convertedData)) {
        return data;
      }
    }

    return this.createNewCycle();
  }

  private createNewSetting(): Settings
  {
    let setting: Settings = {
      sessionTime: 25,
      shortPauseTime: 5,
      bigPauseTime: 15,
      numberOfSessions: 4,
      maxConfirmationTime: 1,
      type: this._settingsKey,
    };
    this.setSettings(setting);
    return setting;
  }

  private createNewCycle(): Cycle
  {
    let cycle: Cycle = {
      currentCycle: 'idle',
      currentNumberOfCycle: 1,
      dateTime: new Date(),
      type: this._cycleKey,
    };
    this.setCycle(cycle);
    return cycle;
  }

  private isValidCycle(cycle: Cycle): boolean
  {
    let date = new Date();
    return date.getDate() === cycle.dateTime.getDate();
  }
}

@Injectable({
  providedIn: 'root'
})
export class HandleCounterService {
  next(cycle: Cycle, sessionNumber: number): Cycle
  {
    if (cycle.currentCycle !== 'work') {
      cycle.currentCycle = 'work';
      cycle.currentNumberOfCycle++;
      return cycle;
    }

    if (cycle.currentNumberOfCycle % sessionNumber === 0) {
      cycle.currentCycle = 'long-break';
    } else {
      cycle.currentCycle = 'short-break';
    }

    return cycle;
  }

  reset(cycle: Cycle): Cycle
  {
    cycle.currentCycle = 'idle';
    cycle.currentNumberOfCycle = 0;
    return cycle;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private _settings: Settings;
  private _cycle: WritableSignal<Cycle>;
  public cycle: Signal<Cycle>;
  private _waitingConfirmation: WritableSignal<boolean>;
  public waitingConfirmation: Signal<boolean>;

  private _stop: Subject<void>;
  private _remainingSeconds: BehaviorSubject<number>;
  private _finish: Subject<void>;
  
  public remainingSeconds: Observable<number>;
  public finish: Observable<void>;

  constructor(
    private _storageService: StorageService,
  ) {
    this._settings = this._storageService.getSettings();
    this._cycle = signal(this._storageService.getCycle());
    this.cycle = this._cycle.asReadonly();
    this._waitingConfirmation = signal(false);
    this.waitingConfirmation = this._waitingConfirmation.asReadonly();

    this._stop = new Subject<void>();
    this._remainingSeconds = new BehaviorSubject<number>(this._getSeconds());
    this.remainingSeconds = this._remainingSeconds.asObservable();
    this._finish = new Subject<void>();
    this.finish = this._finish.asObservable();
  }

  pomodoroStart() : void 
  {
    if (this._cycle().currentCycle === 'idle') {
      this._cycle.set({
        ...this._cycle(),
        currentCycle: 'work',
      });
      this._storageService.setCycle(this._cycle());
    }
    this._start(this._getSeconds());
  }

  pomodoroContinue() : void
  {
    this._start(this._remainingSeconds.value);
  }

  pomodoroRewind() : void
  {
    this.pomodoroStop();
    this._remainingSeconds.next(this._getSeconds());
  }

  pomodoroReset() : void
  {
    this.pomodoroStop();
    this._cycle.set({
      currentCycle: 'idle',
      currentNumberOfCycle: 1,
      dateTime: new Date(),
      type: 'pomodoro.cycle',
    });
    this._storageService.setCycle(this._cycle());
    this._remainingSeconds.next(this._getSeconds());
    this._waitingConfirmation.set(false);
  }

  waitingConfirmationStart() : void
  {
    this._start(this._settings.maxConfirmationTime * 60);
  }

  pomodoroStop(): void
  {
    this._stop.next();
  }

  pomodoroNext() : void
  {
    this.pomodoroStop();
    if (this._cycle().currentCycle !== 'work') {
      this._cycle.set({
        ...this._cycle(),
        currentCycle: 'work',
      })
    } else if (this._cycle().currentNumberOfCycle % this._settings.numberOfSessions === 0) {
      this._cycle.set({
        ...this._cycle(),
        currentCycle: 'long-break',
        currentNumberOfCycle: this._cycle().currentNumberOfCycle + 1,
      });
    } else {
      this._cycle.set({
        ...this._cycle(),
        currentCycle: 'short-break',
        currentNumberOfCycle: this._cycle().currentNumberOfCycle + 1,
      });
    }
    this._waitingConfirmation.set(false);
    this._storageService.setCycle(this._cycle());
    this._remainingSeconds.next(this._getSeconds());
  }

  private _getSeconds(): number
  {
    let time: number;

    switch (this._cycle().currentCycle) {
      case 'idle':
      case 'work':
        time = this._settings.sessionTime;
        break;
      case 'short-break':
        time = this._settings.shortPauseTime;
        break;
      case 'long-break':
        time = this._settings.bigPauseTime;
        break;
    }

    return time * 60;
  }

  private _start(numberSeconds : number) : void
  {
    this.pomodoroStop();

    this._remainingSeconds.next(numberSeconds);
    interval(1000)
      .pipe(
        takeUntil(this._stop),
        takeWhile(() => this._remainingSeconds.value > 0)
      )
      .subscribe(() => {
        const next = this._remainingSeconds.value - 1;
        this._remainingSeconds.next(next);

        if (next === 0) {
          this._finish.next();
          this._confirmationWaiting();
        }
      })
    ;
  }

  private _confirmationWaiting() : void
  {
    this.pomodoroStop();

    this._remainingSeconds.next(this._settings.maxConfirmationTime * 60);
    this._waitingConfirmation.set(true);
    
    interval(1000)
      .pipe(
        takeUntil(this._stop),
        takeWhile(() => this._remainingSeconds.value > 0),
      )
      .subscribe(() => {
        const next = this._remainingSeconds.value - 1;
        this._remainingSeconds.next(next);

        if (next === 0) {
          this._finish.next();
          this.pomodoroReset();
        }
      });
  }
}
