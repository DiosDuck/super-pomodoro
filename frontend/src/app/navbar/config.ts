import { NavItem } from "./models/nav-elems";

export const NAV_ITEMS : NavItem [] = [
    {
        name: 'Home',
        url: '/',
    },
    {
        name: 'Pomodoro',
        url: '/pomodoro',
    },
    {
        name: 'Status',
        url: '/status',
    },
];

export const NAV_MENU_ID = 'nav-menu';
export const NAV_AUTH_ID = 'nav-auth';

export type navId = typeof NAV_MENU_ID | typeof NAV_AUTH_ID | null;
