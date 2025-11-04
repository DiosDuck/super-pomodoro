import { StatusRequest } from "./model/status";

export const STATUS_LIST : StatusRequest [] = [
    {
        name: 'Server Check',
        url: '/api/ping',
    }
];
