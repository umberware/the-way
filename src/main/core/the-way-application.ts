import { CORE } from './core';

export abstract class TheWayApplication {
    constructor() {
        const core = CORE.getCore();

        core.initialization(this, false);
        core.whenReady().subscribe(
            () => {
                if (!core.isDestroyed()) {
                    this.start();
                }
            }
        );
    }
    public start(): void {
        /* eslint-disable-next-line no-console */
        console.log('[The Way] Has been started.');
    }
}
