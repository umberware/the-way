
import { forkJoin, Observable, of, Subscriber, throwError } from 'rxjs';
import { catchError, defaultIfEmpty, map } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import { CORE } from '../core';
import { Logger } from '../shared/logger';
import { InstancesMapModel } from '../model/instances-map.model';
import { RegisterHandler } from './register.handler';
import { ConstructorModel } from '../model/constructor.model';
import { Messages } from '../shared/messages';
import { ConfigurationMetaKey } from '../decorator/configuration.decorator';
import { Configurable } from '../shared/configurable';
import { Destroyable } from '../shared/destroyable';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any
 */
export class InstanceHandler {
    protected INSTANCES: InstancesMapModel;

    constructor(
        protected logger: Logger,
        protected registerHandler: RegisterHandler
    )   {
        this.initialize();
    }

    public buildApplication(constructor: Function): Object {
        const object = this.buildObject(constructor);
        this.registerInstance(object);
        return object;
    }
    public buildInstance<T>(constructor: Function): T | null {
        const registeredConstructor = this.registerHandler.getConstructor(constructor.name);
        const registeredConstructorName = registeredConstructor.name;
        if (!this.INSTANCES[registeredConstructorName]) {
            this.logger.info(Messages.getMessage('initialization-building-instance', [ registeredConstructorName ]));
            const instance = this.buildObject(registeredConstructor.constructorFunction);
            const decorators = Reflect.getMetadataKeys(registeredConstructor.constructorFunction);
            this.registerInstance(instance);
            this.handleInstance(instance, decorators);
            return instance as T;
        } else {
            return this.INSTANCES[registeredConstructorName] as T;
        }
    }
    public buildCoreInstances(): void {
        Object.values(this.registerHandler.getCoreComponents()).forEach(
            (registeredConstructor: ConstructorModel) => {
                this.buildInstance(registeredConstructor.constructorFunction);
            }
        );
    }
    public buildInstances(): void {
        Object.values(this.registerHandler.getComponents()).forEach(
            (registeredConstructor: ConstructorModel) => {
                this.buildInstance(registeredConstructor.constructorFunction);
            }
        );
    }
    protected buildObject(constructor: Function): Object {
        return new constructor.prototype.constructor();
    }
    public caller(methodName: string, instances: Array<any>): Observable<boolean> {
        const results: Array<Observable<any>> = [];

        for (const instance of instances) {
            const observable: Observable<any> = new Observable((observer: Subscriber<any>) => {
                try {
                    const method = Reflect.get(instance, methodName) as Function;
                    const result = Reflect.apply(method, instance, []);

                    if (result instanceof Promise) {
                        fromPromise(result).subscribe(observer);
                    } else if (result instanceof Observable) {
                        result.subscribe(observer);
                    } else {
                        observer.next(result);
                        observer.complete();
                    }
                } catch (ex) {
                    observer.next(ex);
                    observer.complete();
                }
            }).pipe(
                catchError((error: Error) => of(error)),
                defaultIfEmpty(true)
            );
            results.push(observable);
        }
        return forkJoin(results).pipe(
            map((values: Array<any>) => {
                const errors = values.filter((value => value instanceof Error));
                if (errors.length > 0) {
                    throw (values[0]);
                } else {
                    return true;
                }
            }),
            defaultIfEmpty(true)
        );
    }
    public configure(): Observable<boolean> {
        return this.caller('configure', this.registerHandler.getConfigurables());
    }
    public destroy(): Observable<boolean> {
        return this.caller('destroy', this.registerHandler.getDestroyable());
    }
    public getInstanceByName<T>(name: string): T | undefined {
        const registeredConstructor = this.registerHandler.getConstructor(name);
        if (registeredConstructor) {
            return this.INSTANCES[registeredConstructor.name];
        } else {
            return undefined;
        }
    }
    public getInstances(): Array<any> {
        return Object.values(this.INSTANCES);
    }
    protected handleInstance<T>(instance: T, decorators: Array<string>): void {
        if (decorators.includes(ConfigurationMetaKey) && instance instanceof Configurable) {
            this.registerHandler.registerConfigurable(instance);
        }

        if (instance instanceof Destroyable) {
            this.registerHandler.registerDestroyable(instance);
        }
    }
    protected initialize(): void {
        this.INSTANCES = {};
    }
    public registerInstance(instance: Object): void {
        this.INSTANCES[instance.constructor.name] = instance;
    }
}
