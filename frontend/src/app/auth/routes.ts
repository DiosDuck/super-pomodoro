import { Routes } from "@angular/router";
import { unsignedGuard } from "../shared/guards/user-state";

export const AUTH_ROUTES: Routes = [
    {
        path: 'sign-in',
        canMatch: [unsignedGuard],
        loadComponent: () => import('./sign-in/sign-in').then(m => m.SignIn),
    },
    {
        path: 'register',
        canMatch: [unsignedGuard],
        loadComponent: () => import('./register/register').then(m => m.Register),
    },
    {
        path: '',
        redirectTo: '/not-found',
    }
];
