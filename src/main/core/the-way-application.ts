import { CORE } from './core';
import { MessagesEnum } from './model/messages.enum';

export abstract class TheWayApplication {
    constructor() {
        const core = CORE.getCoreInstance();
        CORE.CORE_CALLED += 1;

        if (CORE.CORE_CALLED > 1) {
            throw new Error(MessagesEnum['application-multiples']);
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