import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user";

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
