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

    getJsonParsed(key: string): any
    {
        let rawData = this.get(key);
        if (!rawData) {
            return null;
        }

        let obj = JSON.parse(rawData);
        return obj;
    }

    parseAndSet(key: string, value: any): void
    {
        let rawData = JSON.stringify(value);
        this.set(key, rawData);
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