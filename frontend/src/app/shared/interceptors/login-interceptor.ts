import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "../services/local-storage-service";
import { inject } from "@angular/core";

export function userInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
    const localStorageService = inject(LocalStorageService);
    const token = localStorageService.getUserToken();
    if (token === null) {
        return next(req);
    }

    req.headers.append('Authorization', `Bearer ${token}`);
    return next(req);
}
