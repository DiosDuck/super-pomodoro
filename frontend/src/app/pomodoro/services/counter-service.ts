import { Injectable } from '@angular/core';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  static readonly sessionKey = 'pomodoro.settings';

  public setSettings(settings: Settings): void
  {
    let data = JSON.stringify(settings);
    localStorage.setItem(CounterService.sessionKey, data);
  }

  public getSettings(): Settings
  {
    let data = localStorage.getItem(CounterService.sessionKey);
    if (data === null) {
      return this.createNewSetting();
    }

    let obj = JSON.parse(data);
    if (obj instanceof Settings) {
      return obj;
    }

    return this.createNewSetting();
  }

  private createNewSetting(): Settings
  {
    let setting = new Settings();
    JSON.stringify(setting);
    return setting;
  }
}
