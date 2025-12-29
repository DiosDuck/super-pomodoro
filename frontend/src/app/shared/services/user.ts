import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { User, nullableUser } from '../models/user';
import { LocalStorageService } from './local-storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private _user = new ReplaySubject<nullableUser>(1);
    user = this._user.asObservable();

    private _http = inject(HttpClient);
    private _localStorageService = inject(LocalStorageService);

    logout(): void
    {
        this._localStorageService.removeUserToken();
        this.setUser(null);
    }

    async loadUser(): Promise<void> {
        const token = this._localStorageService.getUserToken();
        if (!token) {
            this.setUser(null);
            return;
        }

        let user : nullableUser;
        try {
            const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`,
            });
            user = await firstValueFrom(this._http.get<User>('/api/profile', {headers: headers}));
        } catch (err) {
            user = null;
            this._localStorageService.removeUserToken();
        }

        this.setUser(user);
    }

    private setUser(user: nullableUser): void
    {
        this._user.next(user);
    }
}
