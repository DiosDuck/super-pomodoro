import { inject, Injectable } from '@angular/core';
import { Settings } from '../models/settings';
import { LocalStorageService } from '../../shared/services/local-storage';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  _localStorageService = inject(LocalStorageService);
  private readonly _sessionKey = 'pomodoro.settings';

  public setSettings(settings: Settings): void
  {
    this._localStorageService.setObject(
      this._sessionKey, 
      settings
    );
  }

  public getSettings(): Settings
  {
    let data = this._localStorageService.getObject(this._sessionKey);
    if (data instanceof Settings) {
      return data;
    }

    return this.createNewSetting();
  }

  private createNewSetting(): Settings
  {
    let setting = new Settings();
    this.setSettings(setting);
    return setting;
  }
}
