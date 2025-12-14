import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LastRouteService {
    private readonly _key = 'lastRoute';

    public getLastRoute(): string
    {
        let lastRoute = localStorage.getItem(this._key);
        return lastRoute ?? '/';
    }

    public setLastRoute(url: string): void
    {
        if (url.includes('auth')) {
            return;
        }

        localStorage.setItem(this._key, url);
    }
}
