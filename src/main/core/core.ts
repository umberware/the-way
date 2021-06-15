import { fromPromise } from 'rxjs/internal-compatibility';
import 'reflect-metadata';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { CoreStateEnum } from './shared/enum/core-state.enum';
import { DependencyHandler } from './handler/dependency.handler';
import { InstanceHandler } from './handler/instance.handler';
import { CoreMessageService } from './service/core-message.service';
import { FileHandler } from './handler/file.handler';
import { PropertiesHandler } from './handler/properties.handler';
import { PropertyModel } from './shared/model/property.model';
import { CoreLogger } from './service/core-logger';
import { RegisterHandler } from './handler/register.handler';
import { HttpTypeEnum } from './shared/enum/http-type.enum';
import { ApplicationException } from './exeption/application.exception';
import { ConstructorMapModel } from './shared/model/constructor-map.model';
import { OverriddenMapModel } from './shared/model/overridden-map.model';
import { DependencyTreeModel } from './shared/model/dependency-tree.model';

'use  strict';

/*
    eslint-disable @typescript-eslint/ban-types,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/explicit-module-boundary-types
*/
/**
 *   @name CORE
 *   @description The core is the heart and brain of this library.
 *      It controls all stages of the application in 4 major steps.
 *   @since 1.0.0
 */
export class CORE {
    protected static APPLICATION: Function | Object;
    protected static END_TIME: Date;
    protected static ERROR: Error;
    protected static INIT_TIME: Date;
    protected static INSTANCE$: BehaviorSubject<CORE | undefined> = new BehaviorSubject<CORE | undefined>(undefined);
    protected static REGISTERING: Array<{ methodName: string; args: Array<any> }> = [];

    protected static STATE$: BehaviorSubject<CoreStateEnum> = new BehaviorSubject<CoreStateEnum>(CoreStateEnum.WAITING);

    protected static afterInitialization(): void {
        const instance = this.getInstance();
        CORE.END_TIME = new Date();
        instance.afterInitialization();
    }
    protected static applyRegistered(): void {
        const core = this.getInstance();
        this.applyRegisteredClass(core.getRegisterHandler());
        if (!this.isDestroyed()) {
            this.STATE$.next(CoreStateEnum.INITIALIZATION_STARTED);
        }
    }
    protected static applyRegisteredClass(registerHandler: RegisterHandler): void {
        this.REGISTERING = this.REGISTERING.sort((a, b) => {
            if (a.methodName === 'registerRest' && b.methodName === 'registerRestPath') {
                return -1;
            } else {
                return 1;
            }
        });
        for (const register of this.REGISTERING) {
            if (this.isDestroyed()) {
                break;
            }
            const method = Reflect.get(registerHandler, register.methodName) as Function;
            Reflect.apply(method, registerHandler, register.args);
        }
    }
    protected static beforeInitialization(): void {
        const instance = this.getInstance();
        CORE.INIT_TIME = new Date();
        instance.beforeInitialization();
        this.whenHasInstanceAndBeforeInitializationIsDone().subscribe(
            () => this.applyRegistered()
        );
    }
    /**
     *   @name createCore
     *   @description This method is called in @Application or in TheWayApplication Constructor.
     *      This method tell to the CORE to initialize the application.
     *   @param application: Can be a Class or Instance of a class. This parameter will be used
     *      to set the application instance. After the initialization,
     *      the method start of TheWayApplication will be called.
     *   @since 1.0.0
     */
    public static createCore(application: Function | Object): void {
        if (!this.INSTANCE$.getValue()) {
            this.INSTANCE$.next(new CORE(application));
            this.APPLICATION = application;
            CORE.STATE$.next(CoreStateEnum.BEFORE_INITIALIZATION_STARTED);
            this.watchState().subscribe(
                (coreState: CoreStateEnum) => {
                    if (coreState === CoreStateEnum.BEFORE_INITIALIZATION_STARTED) {
                        CORE.beforeInitialization();
                    } else if (coreState === CoreStateEnum.INITIALIZATION_DONE) {
                        CORE.afterInitialization();
                    } else if (coreState === CoreStateEnum.INITIALIZATION_STARTED ) {
                        CORE.initialization();
                    } else if (coreState === CoreStateEnum.DESTRUCTION_STARTED) {
                        CORE.destruction();
                    }
                }
            );
        }
    }
    /**
     *   @name destroy
     *   @description This method can be called in any stage of the Core. When called, the Core
     *      will start the process to destroy the instances, configurations and connections.
     *   @return Returns an observable that will emit value when the construction step is done
     *      or an error occurs in the destruction step
     *   @since 1.0.0
     */
    public static destroy(): Observable<CoreStateEnum> {
        if (!this.isDestroyed()) {
            CORE.STATE$.next(CoreStateEnum.DESTRUCTION_STARTED);
        }
        return CORE.whenDestroyed();
    }
    protected static destroyed(code: number, mustExit: boolean): void {
        CORE.STATE$.next(CoreStateEnum.DESTRUCTION_DONE);

        if (mustExit) {
            process.exit(code);
        }

        CORE.INSTANCE$.next(undefined);
    }
    protected static destruction(): void {
        const instance = this.getInstance();
        instance.destroy(this.ERROR);
    }
    /**
     *   @name getConstructors
     *   @description This method will access the register handler and get all the constructions registered
     *   @return Returns all registered constructors: ConstructorMapModel
     *   @since 1.0.0
     */
    public static getConstructors(): ConstructorMapModel {
        const instance = this.getInstance();
        return instance.getRegisterHandler().getComponents();
    }
    /**
     *   @name getCoreState
     *   @description Retrieves the current Core State
     *   @return Actual state: CoreStateEnum
     *   @since 1.0.0
     */
    public static getCoreState(): CoreStateEnum {
        return CORE.STATE$.getValue();
    }
    /**
     *   @name getDependenciesTree
     *   @description Retrieves the dependencies tree of the application
     *   @return The built dependencies tree: DependencyTreeModel
     *   @since 1.0.0
     */
    public static getDependenciesTree(): DependencyTreeModel {
        const instance = this.getInstance();
        return instance.getDependencyHandler().getDependenciesTree();
    }
    /**
     *   @name getInstanceByName
     *   @description Retrieve the class singleton by name class
     *   @param name The class name
     *   @throws ApplicationException: If the wanted instance is not found
     *   @return The instance of the class: T
     *   @since 1.0.0
     */
    public static getInstanceByName<T>(name: string): T {
        const coreInstance = this.getInstance();
        return coreInstance.getInstanceHandler().getInstanceByName<T>(name);
    }
    protected static getInstance(): CORE {
        return this.INSTANCE$.getValue() as CORE;
    }
    /**
     *   @name getInstances
     *   @description Retrieve all instances
     *   @return An array of the instances
     *   @since 1.0.0
     */
    public static getInstances(): Array<any> {
        const instance = this.getInstance();
        return instance.getInstanceHandler().getInstances();
    }
    /**
     *   @name getOverrides
     *   @description Retrieve all overridden classes
     *   @return The overridden map: OverriddenMapModel
     *   @since 1.0.0
     */
    public static getOverrides(): OverriddenMapModel {
        const instance = this.getInstance();
        return instance.getRegisterHandler().getOverridden();
    }
    /**
     *   @name getPropertiesHandler
     *   @description Will return the PropertiesHandler of the application
     *   @return The propertiesHandler: PropertiesHandler
     *   @since 1.0.0
     */
    public static getPropertiesHandler(): PropertiesHandler {
        const instance = this.getInstance();
        return instance.getPropertiesHandlder();
    }
    protected static initialization(): void {
        const instance = this.getInstance();
        instance.initialize(this.APPLICATION);
    }
    /**
     *   @name isDestroyed
     *   @description Will check if the core is destroyed
     *   @return a boolean, when true, the application is destroyed
     *   @since 1.0.0
     */
    public static isDestroyed(): boolean {
        const state: CoreStateEnum = CORE.getCoreState();
        return state === CoreStateEnum.DESTRUCTION_STARTED || state == CoreStateEnum.DESTRUCTION_DONE;
    }
    protected static register(methodName: string, args: Array<any>): void {
        this.REGISTERING.push({
            methodName,
            args
        });
    }
    /**
     *   @name registerConfiguration
     *   @description This method will register a class decorated with @Configuration. For Core use only
     *   @param configurationConstructor The decorated class
     *   @param over The class that must be overridden. It is optional
     *   @since 1.0.0
     */
    public static registerConfiguration(configurationConstructor: Function, over?: Function): void {
        this.register('registerConfiguration', [configurationConstructor, over]);
    }
    /**
     *   @name registerCoreComponent
     *   @description This method will register a core component. For Core use only
     *   @param componentConstructor The Core Component class
     *   @since 1.0.0
     */
    public static registerCoreComponent(componentConstructor: Function): void {
        this.register('registerCoreComponent', [componentConstructor]);
    }
    /**
     *   @name registerInjection
     *   @description This method will register a dependency and map injection point
     *   @param dependencyConstructor The dependency class
     *   @param source The dependent class
     *   @param propertyKey The dependent class injection point
     *   @since 1.0.0
     */
    public static registerInjection(dependencyConstructor: Function, source: object, propertyKey: string): void {
        this.register('registerInjection', [dependencyConstructor, source, propertyKey]);
    }
    /**
     *   @name registerRest
     *   @description This is method is used to register a class decorated with @Rest
     *   @param restConstructor Is the class decorated with @Rest
     *   @param path The father path. All method decorated with RestDecorators will inherit this path
     *   @param authenticated When true, all inherit paths need a user signed in
     *   @param allowedProfiles Is the allowed profiles that can
     *      execute the operations mapped in the methods decorated with some rest decorator
     *   @since 1.0.0
     */
    public static registerRest(
        restConstructor: Function, path?: string, authenticated?: boolean,
        allowedProfiles?: Array<any>
    ): void {
        this.register('registerRest', [restConstructor, path, authenticated, allowedProfiles]);
    }
    /**
     *   @name registerRestPath
     *   @description This is method is used to register a REST operation in methods decorated with some rest decorator
     *   @param httpType Is the HttpTypeEnum (Get, Post, Delete, ...)
     *   @param path Is the operation PATH
     *   @param target Is the method class
     *   @param methodName Is the method name
     *   @param authenticated When true, the mapped operation will be executed only if has a user authenticated
     *   @param allowedProfiles Is the allowed profiles that can execute the operation
     *   @since 1.0.0
     */
    public static registerRestPath(
        httpType: HttpTypeEnum, path: string, target: any, methodName: string,
        authenticated?: boolean, allowedProfiles?: Array<any>
    ): void {
        this.register('registerRestPath',[ httpType, path, target, methodName, authenticated, allowedProfiles ]);
    }
    /**
     *   @name registerService
     *   @description This method will register a class decorated with @Service. For Core use only
     *   @param configurationConstructor The decorated class
     *   @param over The class that must be overridden. It is optional
     *   @since 1.0.0
     */
    public static registerService(serviceConstructor: Function, over?: Function): void {
        this.register('registerService', [serviceConstructor, over]);
    }
    /**
     *   @name setError
     *   @description When this method is called, the destruction step will start and the ERROR will be registered
     *   @param error Is the error that will be registered in the core
     *   @since 1.0.0
     */
    public static setError(error: Error): void {
        this.ERROR = error;
        if (!this.isDestroyed()) {
            CORE.STATE$.next(CoreStateEnum.DESTRUCTION_STARTED);
        }
    }
    /**
     *   @name whenBeforeInitializationIsDone
     *   @description This method return an observable that will emit value when the core assumes the state of BEFORE_INITIALIZATION_DONE
     *   @return Observable<CoreStateEnum>
     *   @since 1.0.0
     */
    public static whenBeforeInitializationIsDone(): Observable<CoreStateEnum> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.BEFORE_INITIALIZATION_DONE),
            take(1)
        );
    }
    /**
     *   @name whenDestroyed
     *   @description This method return an observable that will emit value when the core assumes the state of DESTRUCTION_DONE
     *   @return Observable<CoreStateEnum>
     *   @since 1.0.0
     */
    public static whenDestroyed(): Observable<CoreStateEnum> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.DESTRUCTION_DONE),
            tap(() => {
                if (CORE.ERROR) {
                    throw CORE.ERROR;
                }
            }),
            take(1)
        );
    }
    protected static whenHasInstanceAndBeforeInitializationIsDone(): Observable<CoreStateEnum> {
        return this.INSTANCE$.pipe(
            filter((instance: CORE | undefined) => instance !== undefined),
            switchMap(() => {
                return this.whenBeforeInitializationIsDone();
            }),
            take(1)
        );
    }
    /**
     *   @name whenReady
     *   @description This method return an observable that will emit value when the core assumes the state of READY
     *   @return Observable<CoreStateEnum>
     *   @since 1.0.0
     */
    public static whenReady(): Observable<CoreStateEnum> {
        return this.STATE$.pipe(
            filter((state: CoreStateEnum) => state === CoreStateEnum.READY),
            take(1)
        );
    }
    /**
     *   @name watchState
     *   @description This method will return an observable that will emit every change of the core state
     *   @return Observable<CoreStateEnum>
     *   @since 1.0.0
     */
    public static watchState(): Observable<CoreStateEnum> {
        return this.STATE$;
    }

    protected coreProperties: PropertyModel;
    protected dependencyHandler: DependencyHandler;
    protected fileHandler: FileHandler;
    protected instanceHandler: InstanceHandler;
    protected logger: CoreLogger;
    protected propertiesHandler: PropertiesHandler;
    protected registerHandler: RegisterHandler;

    constructor(protected application: Function | Object) {}

    protected afterInitialization(): void {
        this.logInfo(CoreMessageService.getMessage('step-after-initialization', [this.calculateElapsedTime()]));
        CORE.STATE$.next(CoreStateEnum.READY);
    }
    protected beforeInitialization(): void {
        this.logger = new CoreLogger();
        this.logInfo(CoreMessageService.getMessage('step-before-initialization-started'));
        try {
            this.propertiesHandler = new PropertiesHandler(this.logger);
            this.checkoutProperties();
            this.registerHandler = new RegisterHandler(
                this.propertiesHandler.getProperties('the-way.server') as PropertyModel,
                this.logger
            );
            this.instanceHandler = new InstanceHandler(this.logger, this.registerHandler);
            this.dependencyHandler = new DependencyHandler(this.logger, this.instanceHandler, this.registerHandler);
            this.fileHandler = new FileHandler(this.coreProperties.scan as PropertyModel, this.logger);
            this.instanceHandler.registerInstance(this.logger);
            this.instanceHandler.registerInstance(this.propertiesHandler);
            this.fileHandler.initialize().subscribe(
                () => {
                    this.logInfo(CoreMessageService.getMessage('step-before-initialization-done'));
                    CORE.STATE$.next(CoreStateEnum.BEFORE_INITIALIZATION_DONE);
                }, (error: ApplicationException) => {
                    CORE.setError(error);
                }
            );
        } catch (error) {
            CORE.setError(error);
        }
    }
    protected bindRestPaths(): void {
        this.registerHandler.bindPaths();
    }
    protected build(mainConstructor: Function | Object): Observable<boolean> {
        this.logDebug(CoreMessageService.getMessage('building'));
        return this.buildDependenciesTree().pipe(
            switchMap(() => {
                return this.instanceHandler.buildInstances(mainConstructor, this.dependencyHandler.getDependenciesTree());
            })
        );
    }
    protected buildApplication(constructor: Function | Object): void {
        this.logInfo(CoreMessageService.getMessage('configuring-application-class'));
        if ((typeof constructor) === 'object') {
            this.instanceHandler.registerInstance(constructor);
        } else {
            this.instanceHandler.buildApplication(constructor as Function);
        }
    }
    protected buildDependenciesTree(): Observable<void>  {
        return fromPromise(new Promise((resolve => resolve(this.dependencyHandler.buildDependenciesTree()))));
    }
    protected calculateElapsedTime(): string {
        return ((CORE.END_TIME.getTime() - CORE.INIT_TIME.getTime())/1000) + 's';
    }
    protected checkoutProperties(): void {
        this.coreProperties = this.propertiesHandler.getProperties('the-way.core') as PropertyModel;
        const logProperties = this.coreProperties.log as PropertyModel;
        const languageProperty = this.coreProperties.language as string;
        CoreMessageService.setLanguage(languageProperty);
        this.logger.setProperties(logProperties);
    }
    protected destroy(error?: Error): void {
        let code = 0;
        const mustExit = this.coreProperties && this.coreProperties['process-exit'] as boolean;
        if (error) {
            this.logError(CoreMessageService.getMessage('error'), error as Error);
            code = 1;
        }
        this.logInfo(CoreMessageService.getMessage('step-destruction-started'));
        this.destroyTheArmy().subscribe(
            () => {
                this.logInfo(CoreMessageService.getMessage('destruction-destroyed'));
            }, (destructionError: Error) => {
                const finalError = new ApplicationException(
                    CoreMessageService.getMessage('error-in-destruction', [destructionError.message]),
                    CoreMessageService.getMessage('TW-012'),
                    destructionError
                );
                this.logger.error(finalError, '[The Way]');
                CORE.setError(finalError);
                code = 2;
                CORE.destroyed(code, mustExit);
            }, () => {
                this.logInfo(CoreMessageService.getMessage('step-destruction-done'));
                CORE.destroyed(code, mustExit);
            }
        );
    }
    protected destroyTheArmy(): Observable<boolean> {
        if (this.instanceHandler) {
            return this.instanceHandler.destroy();
        } else {
            return of(true);
        }
    }
    protected getDependencyHandler(): DependencyHandler {
        return this.dependencyHandler;
    }
    protected getInstanceHandler(): InstanceHandler {
        return this.instanceHandler;
    }
    protected getPropertiesHandlder(): PropertiesHandler {
        return this.propertiesHandler;
    }
    protected getRegisterHandler(): RegisterHandler {
        return this.registerHandler;
    }
    protected initialize(mainConstructor: Function | Object): void {
        this.logInfo(CoreMessageService.getMessage('step-initialization-started'));
        this.build(mainConstructor).pipe(
            map(() => {
                this.buildApplication(mainConstructor);
                this.bindRestPaths();
            })
        ).subscribe(
            () => {
                this.logInfo(CoreMessageService.getMessage('step-initialization-done'));
                CORE.STATE$.next(CoreStateEnum.INITIALIZATION_DONE);
            },
            (error: Error) => {
                CORE.setError(error);
            }
        );
    }
    protected logDebug(message: string | number): void {
        this.logger.debug(message.toString(), '[The Way]');
    }
    protected logInfo(message: string | number): void {
        this.logger.info(message.toString(), '[The Way]');
    }
    protected logError(message: string | number, error: Error): void {
        this.logger.error(error, '[The Way]', message.toString());
    }
}
