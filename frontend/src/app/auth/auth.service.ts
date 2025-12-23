import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage';
import { UserService } from '../shared/services/user';
import { LoginData, TokenResponse } from '../shared/models/user';
import { RegisterData } from './register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(
        private _http: HttpClient,
        private _userService: UserService,
        private _localStorageService: LocalStorageService
    ) { }

    async login(loginData : LoginData): Promise<void> {
        try {
            const res = await firstValueFrom(this._http.post<TokenResponse>('/api/auth/login', loginData));
            this._localStorageService.setUserToken(res.token);
        } catch (err) {
            throw err;
        }

        this._userService.loadUser();
    }

    async register(registerData : RegisterData): Promise<void> {
        try {
            await firstValueFrom(this._http.put('/api/auth/register', registerData));
        } catch (err) {
            throw err;
        }
    }
}
