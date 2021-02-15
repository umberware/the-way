import { CORE } from './core';

export abstract class TheWayApplication {
    constructor() {
        const core = CORE.getCoreInstance();

        core.initialize(this, false);
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
