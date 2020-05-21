import { CORE } from './core';

export abstract class TheWayApplication {
    constructor() {
        const core = CORE.getCoreInstance();
        CORE.CORE_CALLED += 1;

        if (CORE.CORE_CALLED > 1) {
            throw new Error('The core are called more than one time.');
        }

        core.buildApplication();  
        core.ready$.subscribe((ready: boolean) => {
            if (ready) {
                this.start();
            }
        });
    }

    public start(): void {};
}