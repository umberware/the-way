import { CORE } from './core';

export abstract class TheWayApplication {
    constructor() {
        const core = CORE.getCoreInstance();
        CORE.CORE_CALLED += 1;

        if (CORE.CORE_CALLED > 1) {
            throw new Error('The core are called more than one time.');
        }

        core.buildApplication().subscribe(
            () => {
                this.start();
                core.setApplicationInstance(this);
            }, () => {
                core.destroy();
            }
        );
    }

    public abstract start(): void
}