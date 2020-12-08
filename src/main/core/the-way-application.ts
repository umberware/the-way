import { CORE } from './core';
import { CoreStateEnum } from './shared/core-state.enum';

export abstract class TheWayApplication {
    constructor() {
        const core = CORE.getCoreInstance();

        if (core.getCoreState() === CoreStateEnum.BEFORE_INITIALIZATION_DONE) {
            core.initialize(this);
        }

        core.whenReady().subscribe(
            () => {
                this.start();
            }
        );
    }
    public start(): void {
        /* eslint-disable-next-line no-console */
        console.log('[The Way] Has been started.');
    }
}
