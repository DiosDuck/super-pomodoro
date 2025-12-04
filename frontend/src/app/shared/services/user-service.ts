import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LoginData, TokenResponse, User, nullableUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private user = signal<nullableUser>(null);
    public currentUser = computed<nullableUser>(() => this.user());

    readonly sessionKey = 'TOKEN';

    constructor(private http: HttpClient) {
        this.getUser();
    }

    async login(loginData : LoginData): Promise<void> {
        try {
            const res = await firstValueFrom(this.http.post<TokenResponse>('/api/auth/login', loginData));
            this.setToken(res.token);
        } catch (err) {
            // do nothing for now
        }

        this.getUser();
    }

    logout(): void
    {
        this.removeToken();
        this.setUser(null);
    }

    private setUser(user : nullableUser): void
    {
        this.user.set(user);
    }

    async getUser(): Promise<void> {
        const token = this.getToken();
        if (!token) {
            this.setUser(null);
            return;
        }

        let user : nullableUser;
        try {
            const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`,
            });
            user = await firstValueFrom(this.http.get<User>('/api/profile', {headers: headers}));
        } catch (err) {
            user = null;
        }

        this.setUser(user);
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
