import { CORE } from './core';
import { CoreStateEnum } from './model/core-state.enum';

export abstract class TheWayApplication {
    constructor() {
        const core = CORE.getCoreInstances()[0];

        if (core.getCoreState() === CoreStateEnum.INITIALIZED) {
            core.execute(this);
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
