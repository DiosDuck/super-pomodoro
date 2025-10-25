import { Routes } from '@angular/router';
import { Status } from './status/status';
import { App } from './app';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path: 'status',
        component: Status,
    },
    {
        path: '',
        component: Home,
        pathMatch: 'full',
    },
    {
        path: 'not-found',
        component: NotFound,
    },
    {
        path: '**',
        redirectTo: '/not-found'
    }
];
