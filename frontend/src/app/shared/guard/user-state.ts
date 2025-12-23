import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user";
import { LocalStorageService } from "../services/local-storage";

export const unsignedGuard: CanActivateChildFn = async () => {
    const userService = inject(UserService);
    await userService.loadUser();

    return userService.currentUser() === null;
}

export const adminGuard: CanActivateFn = async () => {
    const userService = inject(UserService);
    await userService.loadUser();
    
    let user = userService.currentUser();
    if (user === null) {
        return false;
    }

    return user.roles.includes("ROLE_ADMIN");
}

export const logoutGuard: CanActivateFn = () => {
    const userService = inject(UserService);
    const router = inject(Router);
    const localStorageService = inject(LocalStorageService);

    userService.logout();

    return router.navigateByUrl(localStorageService.getLastRoute());
}
