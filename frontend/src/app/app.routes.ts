import { Routes } from '@angular/router';
import { Index as Status } from './status/index/index';
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
