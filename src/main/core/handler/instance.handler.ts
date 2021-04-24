import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { defaultIfEmpty, map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import { Logger } from '../shared/logger';
import { InstancesMapModel } from '../model/instances-map.model';
import { RegisterHandler } from './register.handler';
import { ConstructorModel } from '../model/constructor.model';
import { Messages } from '../shared/messages';
import { Destroyable } from '../shared/destroyable';
import { ApplicationException } from '../exeption/application.exception';
import { DependencyTreeModel } from '../model/dependency-tree.model';
import { Configurable } from '../shared/configurable';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types
 */
export class InstanceHandler {
    protected INSTANCES: InstancesMapModel;
    protected CONFIGURED_INSTANCES = new Set<Function>();

    constructor(
        protected logger: Logger,
        protected registerHandler: RegisterHandler
    )   {
        this.initialize();
    }

    protected bindDependentWithDepedencies(dependent: string, dependencies: Array<string>): void {
        for (const dependency of dependencies) {
            const dependencyInformation = this.registerHandler.getDependency(dependent, dependency);
            const instance = this.getInstanceByName(dependencyInformation.dependencyConstructor.name) as Object;
            const target = dependencyInformation.target as Function;
            const dependencyName = (instance.constructor.name !== dependencyInformation.dependencyConstructor.name) ?
                instance.constructor.name + '( as ' + dependencyInformation.dependencyConstructor.name + ' )' :
                dependencyInformation.dependencyConstructor.name;

            Reflect.set(target, dependencyInformation.key as string, instance);
            this.logger.debug(
                Messages.getMessage(
                    'injection-injected',
                    [dependencyName, dependent, dependencyInformation.key]
                ),
                '[The Way]'
            );
        }
    }
    public buildApplication<T>(constructor: Function): T {
        const object = this.buildObject<T>(constructor);
        this.registerInstance(object);
        return object;
    }
    public buildCoreComponents(): Array<Configurable> {
        this.logger.debug(Messages.getMessage('building-core-instances'), '[The Way]');
        return this.buildComponents(Object.values(this.registerHandler.getCoreComponents()));
    }
    public buildApplicationComponents(): Array<Configurable> {
        this.logger.debug(Messages.getMessage('building-instances'), '[The Way]');
        return this.buildComponents(Object.values(this.registerHandler.getComponents()));
    }
    protected buildComponents(components: Array<any>): Array<Configurable> {
        const configurable: Array<Configurable> = [];
        components.forEach(
            (registeredConstructor: ConstructorModel) => {
                const instance = this.buildInstance(registeredConstructor.constructorFunction);
                if ((instance instanceof Configurable) && !this.CONFIGURED_INSTANCES.has((instance as Configurable).constructor)) {
                    configurable.push(instance);
                }
            }
        );
        return configurable;
    }
    public buildDependenciesInstances(
        constructor: Function | Object,
        dependencyTree: DependencyTreeModel
    ): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            const dependencies = Object.keys(dependencyTree);
            const handler = new BehaviorSubject<Array<string>>(dependencies);
            const handledDepencencies = new Set<string>();

            handler.subscribe(
                (dependencies: Array<string>) => {
                    if (dependencies.length === 0) {
                        handler.complete();
                    } else {
                        const dependency = dependencies.shift() as string;
                        const subTree = dependencyTree[dependency];
                        const subDependencies = (subTree) ? Object.keys(subTree) : [];

                        if (!handledDepencencies.has(dependency) && subDependencies.length > 0) {
                            dependencies.unshift(...subDependencies);
                            handledDepencencies.add(dependency);
                            dependencies.push(dependency);
                            handler.next(dependencies);
                        } else {
                            this.bindDependentWithDepedencies(dependency, subDependencies);
                            const constructor = this.registerHandler.getConstructor(dependency)?.constructorFunction;
                            if (constructor) {
                                this.buildInstanceAndConfigure(constructor).subscribe(
                                    () => handler.next(dependencies),
                                    (error) => handler.error(error)
                                );
                            } else {
                                handler.next(dependencies);
                            }
                        }
                    }
                }, (error => {
                    observer.error(error);
                    observer.complete();
                }), () => {
                    observer.next(true);
                    observer.complete();
                }
            );
        });
    }
    protected buildObject<T>(constructor: Function): T {
        return new constructor.prototype.constructor();
    }
    protected buildObservableFromResult(result: any): Observable<any> {
        if (result instanceof Promise) {
            return fromPromise(result);
        } else if (result instanceof Observable) {
            return result;
        } else if (result) {
            return of(result);
        } else {
            return of(undefined);
        }
    }
    public buildInstance<T>(constructor: Function): T {
        const registeredConstructor = this.registerHandler.getConstructor(constructor.name);
        const registeredConstructorName = registeredConstructor.name;
        if (!this.INSTANCES[registeredConstructorName]) {
            this.logger.debug(
                Messages.getMessage('building-instance', [ registeredConstructorName ]),
                '[The Way]'
            );
            const instance = this.buildObject(registeredConstructor.constructorFunction);
            this.registerInstance(instance);
            this.handleInstance(instance);
            return instance as T;
        } else {
            return this.INSTANCES[registeredConstructorName] as T;
        }
    }
    public buildInstanceAndConfigure(constructor: Function): Observable<any> {
        const instance = this.buildInstance(constructor);
        if (this.registerHandler.getConfigurables().has(constructor) && !this.CONFIGURED_INSTANCES.has(constructor)) {
            return this.configureInstance(instance as Configurable).pipe(
                map(() => {
                    this.CONFIGURED_INSTANCES.add(constructor);
                })
            );
        } else {
            return of(true);
        }
    }
    public buildInstances(constructor: Function | Object, dependencyTree: DependencyTreeModel): Observable<boolean> {
        this.logger.debug(Messages.getMessage('building-dependencies-instances'), '[The Way]');
        return this.buildDependenciesInstances(constructor, dependencyTree).pipe(
            switchMap(() => {
                const configurableInstances = this.buildCoreComponents();
                configurableInstances.push(...this.buildApplicationComponents());
                return this.configureInstances(configurableInstances);
            })
        );
    }
    protected caller(methodName: string, instances: Array<any>, messageKey: string): Observable<boolean> {
        const results: Array<Observable<any>> = [];

        for (const instance of instances) {
            let observable: Observable<any>;
            try {
                this.logger.debug(Messages.getMessage(messageKey, [ instance.constructor.name ]), '[The Way]');
                const method = Reflect.get(instance, methodName) as Function;
                const result = Reflect.apply(method, instance, []);
                observable = this.buildObservableFromResult(result);
            } catch (ex) {
                observable = of(ex);
            }

            results.push(observable);
        }
        return forkJoin(results).pipe(
            map((values: Array<any>) => {
                const errors = values.filter((value => {
                    return value !== undefined && (
                        value instanceof Error || value.code !== undefined
                    );
                }));

                if (errors.length > 0) {
                    throw (errors[0]);
                } else {
                    return true;
                }
            }),
            defaultIfEmpty(true)
        );
    }
    protected configureInstance(instance: Configurable): Observable<any> {
        try {
            return this.buildObservableFromResult((instance).configure());
        } catch (ex) {
            return throwError(ex);
        }
    }
    protected configureInstances(instances: Array<Configurable>): Observable<boolean> {
        return this.caller('configure', instances, 'configuring-instance');
    }
    public destroy(): Observable<boolean> {
        return this.caller('destroy', this.registerHandler.getDestroyable(), 'destruction-instance');
    }
    public getInstanceByName<T>(name: string): T {
        const registeredConstructor = this.registerHandler.getConstructor(name);
        if (registeredConstructor) {
            return this.INSTANCES[registeredConstructor.name];
        } else {
            throw new ApplicationException(
                Messages.getMessage('error-not-found-instance', [name]),
                Messages.getMessage('TW-012')
            );
        }
    }
    public getInstances(): Array<any> {
        return Object.values(this.INSTANCES);
    }
    protected handleInstance<T>(instance: T): void {
        if (instance instanceof Destroyable) {
            this.registerHandler.registerDestroyable(instance);
        }
    }
    protected initialize(): void {
        this.INSTANCES = {};
    }
    public registerInstance<T>(instance: T): void {
        this.INSTANCES[(instance as any).constructor.name] = instance;
    }
}
