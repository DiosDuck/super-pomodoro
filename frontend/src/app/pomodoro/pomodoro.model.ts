export interface Settings {
    sessionTime: number,
    shortPauseTime: number,
    bigPauseTime: number,
    numberOfSessions: number,
    maxConfirmationTime: number,
    type: 'pomodoro.settings',
}

export interface Cycle {
    currentCycle: 'idle' | 'work' | 'short-break' | 'long-break',
    currentNumberOfCycle: number,
    dateTime: Date,
    type: 'pomodoro.cycle',
}
