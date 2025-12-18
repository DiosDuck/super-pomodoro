import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    private readonly _loginSessionToken = 'TOKEN';
    private readonly _lastRouteSession = 'lastRoute';

    getUserToken(): string | null
    {
        return this.get(this._loginSessionToken);
    }

    setUserToken(token: string): void
    {
        this.set(this._loginSessionToken, token);
    }

    removeUserToken(): void
    {
        this.remove(this._loginSessionToken);
    }

    getLastRoute(): string | null
    {
        return this.get(this._lastRouteSession);
    }

    setLastRoute(url: string): void
    {
        if (url.includes('auth')) {
            return;
        }

        this.set(this._lastRouteSession, url);
    }

    removeLastRoute(): void
    {
        this.remove(this._lastRouteSession);
    }

    get(key: string): string | null
    {
        return localStorage.getItem(key);
    }

    set(key: string, value: string): void
    {
        localStorage.setItem(key, value);
    }

    remove(key: string): void
    {
        localStorage.removeItem(key);
    }
}