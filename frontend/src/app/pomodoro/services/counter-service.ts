import { Injectable } from '@angular/core';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  public getSettings(): Settings
  {
    let data = localStorage.getItem('pomodoro.settings');
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
