export interface SettingsHttp {
    workTime: number,
    shortBreakTime: number,
    longBreakTime: number,
    cyclesBeforeLongBreak: number,
    maxConfirmationTime: number,
}

export interface Settings extends SettingsHttp {
    type: 'pomodoro.settings',
}

export interface Cycle {
    currentCycle: 'idle' | 'work' | 'short-break' | 'long-break',
    currentNumberOfCycle: number,
    dateTime: Date,
    type: 'pomodoro.cycle',
}
