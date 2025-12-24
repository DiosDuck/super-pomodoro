import { Routes } from '@angular/router';
import { adminGuard } from './shared/guards/user-state';

export const routes: Routes = [
    {
        path: 'status',
        canMatch: [adminGuard],
        loadComponent: () => import('./status/index/index').then(m => m.Index),
    },
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home/home').then(m => m.Home),
    },
    {
        path: 'pomodoro',
        loadComponent: () => import('./pomodoro/components/index/index').then(m => m.Index),
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/routes').then(m => m.AUTH_ROUTES),
    },
    {
        path: 'not-found',
        loadComponent: () => import('./not-found/not-found').then(m => m.NotFound),
    },
    {
        path: '**',
        redirectTo: '/not-found'
    }
];
