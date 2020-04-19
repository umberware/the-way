import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs';

import { ServiceMetaKey, ConfigurationMetaKey } from './decorator';
import { AbstractConfiguration } from './configuration/abstract.configuration';
import { HttpService } from './service/http/http.service';

export class CORE {
    private static instance: CORE;
    private application: Object;
    private INSTANCES = new Map<string, Object>();
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() {
        CORE.instance = this;
    }
    
    public buildApplication(constructor: Function): void {
        this.application = this.buildObject(constructor.prototype);
        console.log(this.INSTANCES)

        if (!this.INSTANCES[HttpService.name]) {
            this.INSTANCES[HttpService.name] = new HttpService();
        }
        this.ready$.next(true);
    }
    public buildObject(prototype: any): Object {
        return new (Object.create(prototype)).constructor();
    }
    public getApplicationInstance(): Object {
        return this.application;
    }
    public getInjectable(constructor: Function): Object {
        const name = constructor.name;
        
        if (this.INSTANCES.has(name)) {
            return this.INSTANCES.get(name);
        } else {
            const instance = this.buildObject(constructor.prototype);
            const decorators = Reflect.getMetadataKeys(constructor);
            this.handleInstance(constructor, instance, decorators);
            return instance;
        }
    }
    public static getInstance(): CORE {
        if (!this.instance) {
            new CORE();
        }
        return this.instance;
    }
    public getInjectables(): Map<String, Object> {
        return this.INSTANCES;
    }
    public getHttpService(): any {
        return null;
        // return this.INSTANCES[HttpService.name];
    }
    private handleInstance(constructor: any, instance: Object, decorators: Array<string>): void{
        if (decorators.includes(ServiceMetaKey)) {
            const clazz = Reflect.getMetadata(ServiceMetaKey, constructor);
            this.INSTANCES[clazz.name] = instance;
            return;
        } else {
            this.INSTANCES[constructor.name] = instance;
        }

        if (decorators.includes(ConfigurationMetaKey) && instance instanceof AbstractConfiguration) {
            (instance as AbstractConfiguration).configure();
        }
    }
}