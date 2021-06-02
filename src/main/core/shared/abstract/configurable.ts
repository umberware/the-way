import { Observable } from 'rxjs';

import { Destroyable } from './destroyable';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *   @name Configurable
 *   @description This abstract class can be used to auto configure an object instance.
 *      When a class extends Configurable and is registered in the Core,
 *      when the core instantiates the class, the method: configure, will be called.
 *   @since 1.0.0
 */
export abstract class Configurable extends Destroyable {
    /**
     *   @name configure
     *   @description This method is designed to be called when the Core instantiate a class,
     *      so if you need start a connection, prepare something for your application or configure, this method is for it
     *   @return The return of this method can be a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [RxJs Observable](https://rxjs.dev/api/index/class/Observabl) or all not "async" types
     *   @since 1.0.0
     */
    abstract configure(): Observable<any> | Promise<any> | any;
}
