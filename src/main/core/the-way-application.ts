import { CORE } from './core';

/* eslint-disable @typescript-eslint/no-empty-function */
export abstract class TheWayApplication {
    constructor() {
        CORE.createCore(this);
        CORE.whenReady().subscribe(
            () => {
                if (!CORE.isDestroyed()) {
                    this.start();
                }
            }
        );
    }

    public start(): void {}
}
