import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { LoginData, TokenResponse, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    user: User | null = null;
    readonly sessionKey = 'TOKEN';

    constructor(private http: HttpClient) {}

    async login(loginData : LoginData): Promise<User | null> {
        try {
            const res = await firstValueFrom(this.http.post<TokenResponse>('/api/auth/login', loginData));
            this.setToken(res.token);

            return this.getUser();
        } catch (err) {
            return null;
        }
    }

    async getUser(): Promise<User | null> {
        if (this.user) {
            return this.user;
        }

        const token = this.getToken();
        if (!token) {
            return null;
        }

        try {
            const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`,
            });
            return await firstValueFrom(this.http.get<User>('/api/profile', {headers: headers}));
        } catch (err) {
            return null;
        }
    }

    logout(): void
    {
        this.removeToken();
    }

    private getToken(): string | null
    {
        return localStorage.getItem(this.sessionKey);
    }

    private setToken(token : string): void
    {
        localStorage.setItem(this.sessionKey, token);
    }

    private removeToken(): void
    {
        localStorage.removeItem(this.sessionKey);
    }
}
