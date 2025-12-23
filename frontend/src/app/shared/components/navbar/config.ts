import { NavItem } from "./models/nav-elems";

export const NAV_MENU_ITEMS : NavItem [] = [
    {
        name: 'Home',
        url: '/',
        loggedIn: false,
        adminRequired: false,
    },
    {
        name: 'Pomodoro',
        url: '/pomodoro',
        loggedIn: false,
        adminRequired: false,
    },
    {
        name: 'Status',
        url: '/status',
        loggedIn: true,
        adminRequired: true,
    },
];

export const NAV_MENU_ID = 'nav-menu';
export const NAV_AUTH_ID = 'nav-auth';

export type navId = typeof NAV_MENU_ID | typeof NAV_AUTH_ID | null;
