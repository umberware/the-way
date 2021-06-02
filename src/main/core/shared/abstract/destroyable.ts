import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *   @name Destroyable
 *   @description This abstract class can be used to auto destroy an object instance.
 *      When a class extends Destroyable and is registered in the Core,
 *      when the core assumes the destruction state,
 *      the Core will call for every class that extends Destroyable the method: destroy.
 *   @since 1.0.0
 */
export abstract class Destroyable {
    /**
     *   @name destroy
     *   @description This method is designed to be called before destruction,
     *      so if you need to save, clean up or disconnect from another service, this method is for it
     *   @return The return of this method can be a
     *      [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise),
     *      [RxJs Observable](https://rxjs.dev/api/index/class/Observabl) or all not "async" types
     *   @since 1.0.0
     */
    public abstract destroy(): Observable<any> | Promise<any> | any;
}
