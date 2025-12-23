import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    private readonly _loginSessionToken = 'TOKEN';

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