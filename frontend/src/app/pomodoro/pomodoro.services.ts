import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../shared/services/local-storage';
import { Cycle, Settings } from './pomodoro.model';
import { BehaviorSubject, interval, Observable, Subject, takeUntil, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  _localStorageService = inject(LocalStorageService);
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
      currentNumberOfCycle: 0,
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
  private _cycle: Cycle;

  private _stop: Subject<void>;
  private _remainingSeconds: BehaviorSubject<number>;
  private _finish: Subject<void>;
  
  public remainingSeconds: Observable<number>;
  public finish: Observable<void>;

  constructor(
    storageService: StorageService,
  ) {
    this._settings = storageService.getSettings();
    this._cycle = storageService.getCycle();

    this._stop = new Subject<void>();
    this._remainingSeconds = new BehaviorSubject<number>(this._getSeconds());
    this.remainingSeconds = this._remainingSeconds.asObservable();
    this._finish = new Subject<void>();
    this.finish = this._finish.asObservable();
  }

  pomodoroStart() : void 
  {
    this._start(this._getSeconds());
  }

  waitingConfirmationStart() : void
  {
    this._start(this._settings.maxConfirmationTime * 60);
  }

  stop(): void
  {
    this._stop.next();
  }

  next() : void
  {
    this.stop();
    if (this._cycle.currentCycle !== 'work') {
      this._cycle.currentCycle = 'work';
      this._cycle.currentNumberOfCycle++;
      return;
    }

    if (this._cycle.currentNumberOfCycle % this._settings.numberOfSessions === 0) {
      this._cycle.currentCycle = 'long-break';
    } else {
      this._cycle.currentCycle = 'short-break';
    }
  }

  private _getSeconds(): number
  {
    let time: number;

    switch (this._cycle.currentCycle) {
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
    this.stop();

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
        }
      })
    ;
  }
}
