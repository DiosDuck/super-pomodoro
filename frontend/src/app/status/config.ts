import { StatusRequest } from "./models/status";

export const STATUS_LIST : StatusRequest [] = [
    {
        name: 'Server Check',
        url: '/api/ping',
    },
    {
        name: 'Server Check but with error',
        url: '/api/ping?fail=1',
    },
];
