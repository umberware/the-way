import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs';

import { ServiceMetaKey } from './decorator/service.decorator';
import { ConfigurationMetaKey } from './decorator/configuration.decorator';
import { AbstractConfiguration } from './configuration/abstract.configuration';
import { CryptoService } from './service/crypto.service';

export let CORE_CALLED = 0;

export class CORE {
    public static enabledDecoratorLog = true;
    private static instance: CORE;
    private application: Object;
    private INSTANCES = new Map<string, Object>();
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() {
        CORE.instance = this;
        CORE_CALLED += 1;
        this.buildCoreInjectables();
    }
    
    public buildApplication(constructor: Function, customInstances: Array<Function>): void {
        if (customInstances && customInstances.length > 0) {
            this.buildCustomInstances(customInstances)
        }

        this.application = this.buildObject(constructor.prototype);
        this.ready$.next(true);
    }
    private buildCoreInjectables(): void {
        this.buildInjectable(CryptoService);
    }
    private buildCustomInstances(customInstances: Array<Function>): void {
        for (const customInstance of customInstances) {
            this.buildInjectable(customInstance);
        }
    }
    private buildInjectable(constructor: Function): Object {
        const instance = this.buildObject(constructor.prototype);
        const decorators = Reflect.getMetadataKeys(constructor);
        this.handleInstance(constructor, instance, decorators);
        return instance;
    }
    public buildObject(prototype: any): Object {
        return new (Object.create(prototype)).constructor();
    }
    public getApplicationInstance(): Object {
        return this.application;
    }
    public getInjectable(constructor: Function): Object {
        const name = constructor.name;
        let instance: Object;
        if (this.INSTANCES[name]) {
            instance = this.getInjectableByName(name);
        } else {
            instance = this.buildInjectable(constructor);
        }

        return instance;
    }
    public getInjectableByName(name: string): Object {
        return this.INSTANCES[name];
    }
    public static getInstance(): CORE {
        if (!CORE.instance) {
            CORE.instance = new CORE();
        }
        return CORE.instance;
    }
    public getInjectables(): Map<String, Object> {
        return this.INSTANCES;
    }
    private handleInstance(constructor: any, instance: Object, decorators: Array<string>): void {
        if (decorators.includes(ServiceMetaKey)) {
            const clazz = Reflect.getMetadata(ServiceMetaKey, constructor);
            if (clazz) {
                this.INSTANCES[clazz.name] = instance;
            } else {
                this.INSTANCES[constructor.name] = instance;
            }
        } else {
            this.INSTANCES[constructor.name] = instance;
        }

        if (decorators.includes(ConfigurationMetaKey) && instance instanceof AbstractConfiguration) {
            (instance as AbstractConfiguration).configure();
        }
    }
}