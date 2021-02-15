import { CORE } from '../core';
import { Logger } from '../shared/logger';
import { InstancesMapModel } from '../model/instances-map.model';
import { RegisterHandler } from './register.handler';
import { ConstructorModel } from '../model/constructor.model';
import { Messages } from '../shared/messages';

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
            this.handleInstance(registeredConstructorName, instance, decorators);
            return instance as T;
        } else {
            return this.INSTANCES[registeredConstructorName] as T;
        }
    }
    protected buildObject(constructor: Function): Object {
        return new constructor.prototype.constructor();
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
    protected handleInstance<T>(instanceableName: string, instance: T, decorators: Array<string>): void {
        // this.INSTANCES.set(instanceableName, instance as Object);
        // if (decorators.includes(ConfigurationMetaKey) && instance instanceof AbstractConfiguration) {
        //     this.configurationHandler.configureInstance(instance);
        // }
        //
        // if (instance instanceof Destroyable) {
        //     this.configurationHandler.registerDestroyable(instance);
        // }
    }
    public registerInstance(instance: Object): void {
        this.INSTANCES[instance.constructor.name] = instance;
    }
}
