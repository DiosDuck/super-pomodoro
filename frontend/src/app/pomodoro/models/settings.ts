export class Settings {
    public constructor(
        public sessionTime: number = 25,
        public shortPauseTime: number = 5,
        public bigPauseTime: number = 15,
        public numberOfSessions: number = 3,
    ) {}
}
