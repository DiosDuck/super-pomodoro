import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user";
import { filter, map, take } from "rxjs";
import { TokenVerification } from "../models/user";
import { HttpClient } from "@angular/common/http";
import { ToastService } from "../services/toast";

export const unsignedGuard: CanActivateChildFn = () => {
    const userService = inject(UserService);

    return userService.user.pipe(
        filter(user => undefined !== user),
        take(1),
        map(user => user === null),
    );
}

export const adminGuard: CanActivateFn = () => {
    const userService = inject(UserService);
    
    return userService.user.pipe(
        filter(user => undefined !== user),
        take(1),
        map(user => user !== null && user.roles.includes("ROLE_ADMIN")),
    );
}

export const verifyEmailGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
    const userService = inject(UserService);
    const toastService = inject(ToastService);
    const router = inject(Router);
    const http = inject(HttpClient);

    let queryParams = route.queryParams;
    let tokenVerification: TokenVerification = {
        token: queryParams['token'] ?? '',
        id: parseInt(queryParams['id'] ?? -1),
    }

    http.post('/api/auth/verify-email', tokenVerification)
        .subscribe({
            next: () => toastService.addToast('User is now active', 'success'),
            error: () => toastService.addToast('There has been an error with activating the user, please try again', 'error'),
        })
    ;

    userService.logout();    
    return router.parseUrl('/auth/sign-in');
}
