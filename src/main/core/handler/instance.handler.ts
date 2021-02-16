import { CORE } from '../core';
import { Logger } from '../shared/logger';
import { InstancesMapModel } from '../model/instances-map.model';
import { RegisterHandler } from './register.handler';
import { ConstructorModel } from '../model/constructor.model';
import { Messages } from '../shared/messages';
import { ConfigurationMetaKey } from '../decorator/configuration.decorator';
import { Configurable } from '../shared/configurable';
import { Destroyable } from '../shared/destroyable';
import { forkJoin, Observable } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any
 */
export class InstanceHandler {
    protected INSTANCES: InstancesMapModel;

    constructor(
        protected core: CORE,
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
    public buildInstances(): void {
        Object.values(this.registerHandler.getConstructors()).forEach(
            (registeredConstructor: ConstructorModel) => {
                this.buildInstance(registeredConstructor.constructorFunction);
            }
        );
    }
    public buildInstance<T>(constructor: Function): T | null {
        const registeredConstructor = this.registerHandler.getConstructor(constructor.name);
        const registeredConstructorName = registeredConstructor.name;
        if (!this.INSTANCES[registeredConstructorName]) {
            this.logger.info(Messages.getMessage('building-class', [ registeredConstructorName ]));
            const instance = this.buildObject(registeredConstructor.constructorFunction);
            const decorators = Reflect.getMetadataKeys(registeredConstructor.constructorFunction);
            this.registerInstance(instance);
            this.handleInstance(instance, decorators);
            return instance as T;
        } else {
            return this.INSTANCES[registeredConstructorName] as T;
        }
    }
    protected buildObject(constructor: Function): Object {
        return new constructor.prototype.constructor();
    }
    public configure(): Observable<boolean> {
        const configurables: Array<Observable<void>> = [];

        for (const configurable of this.registerHandler.getConfigurables()) {
            const result = configurable.configure();
            if (result instanceof Promise) {
                configurables.push(fromPromise(result));
            } else {
                configurables.push(result);
            }
        }

        return forkJoin(configurables).pipe(
            map(() => true),
            defaultIfEmpty(true)
        );
    }
    public destroy(): Observable<boolean> {
        const destroyables: Array<Observable<void>> = [];

        for (const configurable of this.registerHandler.getDestroyable()) {
            const result = configurable.destroy();
            if (result instanceof Promise) {
                destroyables.push(fromPromise(result));
            } else {
                destroyables.push(result);
            }
        }

        return forkJoin(destroyables).pipe(
            map(() => true),
            defaultIfEmpty(true)
        );
    }
    protected initialize(): void {
        this.INSTANCES = {};
    }
    public getInstanceByName<T>(name: string): T{
        const registeredConstructor = this.registerHandler.getConstructor(name);
        return this.INSTANCES[registeredConstructor.name];
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
    public registerInstance(instance: Object): void {
        this.INSTANCES[instance.constructor.name] = instance;
    }
}
