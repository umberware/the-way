import { CORE } from './core';

/* eslint-disable @typescript-eslint/no-empty-function */

/**
 *   @name TheWayApplication
 *   TheWayApplication class is fundamental to work with TheWay framework.
 *      To use this framework you must have a class decorated with @Application.
 *      When you pass to the @Application false, the core will not start automatically,
 *      but when you instantiate your main class(decorated and extended with TheWayApplication),
 *      TheWayApplication constructor will call the Core to initialize the application.
 *   @since 1.0.0
 */
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

    /**
     * @name start
     * @description When the CORE is initialized, this method will be called.
     *      The default implementation is empty,
     *      and you can customize this method into your class that extends
     *      TheWayApplication to execute something.
    * */
    public start(): void {}
}
