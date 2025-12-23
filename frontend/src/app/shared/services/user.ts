import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User, nullableUser } from '../models/user';
import { LocalStorageService } from './local-storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private _user = signal<nullableUser>(null);
    public currentUser = computed<nullableUser>(() => this._user());

    constructor(private _http: HttpClient, private _localStorageService: LocalStorageService) {
        this.loadUser();
    }

    logout(): void
    {
        this._localStorageService.removeUserToken();
        this.setUser(null);
    }

    async loadUser(): Promise<void> {
        if (this._user()) {
            return;
        }

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

    private setUser(user : nullableUser): void
    {
        this._user.set(user);
    }
}
