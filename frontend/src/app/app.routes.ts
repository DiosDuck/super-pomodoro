import { Routes } from '@angular/router';
import { adminGuard, verifyEmailGuard } from './shared/guards/user-state';

export const routes: Routes = [
    {
        path: 'status',
        canMatch: [adminGuard],
        title: 'Status page',
        loadComponent: () => import('./status/index/index').then(m => m.Index),
    },
    {
        path: '',
        pathMatch: 'full',
        title: 'Home',
        loadComponent: () => import('./home/home').then(m => m.Home),
    },
    {
        path: 'pomodoro',
        loadChildren: () => import('./pomodoro/pomodoro.routes').then(m => m.POMODORO_ROUTES),
    },
    {
        path: 'verify-email',
        title: 'Email Verification',
        canActivate: [verifyEmailGuard],
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {
        path: 'not-found',
        title: 'Womp Womp',
        loadComponent: () => import('./not-found/not-found').then(m => m.NotFound),
    },
    {
        path: '**',
        redirectTo: '/not-found'
    }
];
