export class Settings {
    public constructor(
        public sessionTime: number = 25,
        public shortPauseTime: number = 5,
        public bigPauseTime: number = 15,
        public numberOfSessions: number = 4,
        public maxConfirmationTime: number = 1,
        public currentCycle: 'idle' | 'work' | 'short-break' | 'long-break' = 'idle',
        public currentNumberOfCycle: number = 0,
    ) {}

    public next(): void 
    {
        if (this.currentCycle !== 'work') {
            this.currentNumberOfCycle ++;
            this.currentCycle = 'work';
            return;
        }

        if (this.currentNumberOfCycle % this.numberOfSessions === 0) {
            this.currentCycle = 'long-break';
            return;
        }

        this.currentCycle = 'short-break';
    }

    public reset(): void
    {
        this.currentCycle = 'idle';
        this.currentNumberOfCycle = 0;
    }
}
