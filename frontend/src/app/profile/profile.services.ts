import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UpdateUserService {
    private _http = inject(HttpClient);
    
    updatePassword(oldPassword: string, newPassword: string): Observable<Object>
    {
        return this._http.post(
            '/api/auth/password/change-password',
            {
                password: oldPassword,
                newPassword: newPassword,
            },
        );
    }

    deleteAccount(password: string): Observable<Object>
    {
        return this._http.delete(
            '/api/profile',
            {
                body: {
                    password: password
                }
            },
        );
    }
}