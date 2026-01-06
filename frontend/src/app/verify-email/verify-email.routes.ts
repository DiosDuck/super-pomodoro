import { Routes } from "@angular/router";
import { verifyEmailRegisterGuard } from "./verify-email.guards";

export const VERIFY_EMAIL_ROUTES: Routes = [
    {
        path: 'register',
        canActivate: [verifyEmailRegisterGuard],    
    },
    {
        path: '**',
        redirectTo: '/not-found',
    }
];
