[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/core.ts)

## Core

The core is the heart and brain of this library. It controls all stages of the application in 4 major steps.

### Summary

 - [Decorator @Application and Core](#decorator-application-and-core)
 - [Core States](#core-states)
 - [Step: Before Initialization](#step-before-initialization)
 - [Step: Initialization](#step-initialization)
 - [Step: After Initialization](#step-after-initialization)
 - [Step: Destruction](#step-destruction)
 - [Method: static createCore](#method-static-createcore)
 - [Method: static destroy](#method-static-destroy)
 - [Method: static getConstructors](#method-static-getconstructors)
 - [Method: static getCoreState](#method-static-getcorestate)
 - [Method: static getDependenciesTree](#method-static-getdependenciestree)
 - [Method: static getInstanceByName](#method-static-getinstancebyname)
 - [Method: static getInstances](#method-static-getinstances)
 - [Method: static getOverrides](#method-static-getoverrides)
 - [Method: static getPropertiesHandler](#method-static-getpropertieshandler)
 - [Method: static isDestroyed](#method-static-isdestroyed)
 - [Method: static registerConfiguration](#method-static-registerconfiguration)
 - [Method: static registerCoreComponent](#method-static-registercorecomponent)
 - [Method: static registerInjection](#method-static-registerinjection)
 - [Method: static registerRest](#method-static-registerrest)
 - [Method: static registerRestPath](#method-static-registerrestpath)
 - [Method: static registerService](#method-static-registerservice)
 - [Method: static setError](#method-static-seterror)
 - [Method: static whenBeforeInitializationIsDone](#method-static-whenbeforeinitializationisdone)
 - [Method: static whenDestroyed](#method-static-whendestroyed)
 - [Method: static whenReady](#method-static-whenready)
 - [Method: static watchState](#method-static-watchstate)

### Decorator @Application and Core

The [@Application](decorator/core-decorators.md#application) and [TheWayApplication](the-way-application.md) are primordial to use this library.
When a CoreInstance is created, the initialization step will initialize. The Core steps will be described in the subsequent sections.

A CoreInstance is created when:

- A class decorated with [@Application](decorator/core-decorators.md#application) with no parameters or with the parameter automatic = true and extends the class [TheWayApplication](the-way-application.md)
- A class decorated with [@Application](decorator/core-decorators.md#application) with the parameter automatic = false, is extended with [TheWayApplication](the-way-application.md) and the new is called

So, it's automatic or manually called.

*Automatic: @Application with no parameters and a class extended with TheWayApplication class*

    import { Application, TheWayApplication } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {}

**The above example, the application will start automatically**


*Manually: @Application with parameter automatic with the value false, and a class extended with TheWayApplication class*

    import { Application, TheWayApplication } from '@umberware/the-way';

    @Application(false)
    export class Main extends TheWayApplication {}

    ...

     new Main();

**In the example above, the application will start when the main class is created**

### Core States

The Core has a method that return an Observable from [rxjs](https://rxjs-dev.firebaseapp.com/) and this observable will return via .subscribe the current CoreState of the Core.
When the Core State change, the observable will emit this new value.
The values of this observable/CoreState has the type [CoreStateEnum](shared/enum/core-state-enum.md) and the Core first state is [WAITING](shared/enum/core-state-enum.md#WAITING)

### Step: Before Initialization

This is the first step and is activated when the Core Instance is created.

Is responsible for:

- Read the application.properties.yml with [PropertiesHandler](handler/properties-handler.md)
- Create [RegisterHandler](handler/register-handler.md) and prepare to register paths, classes and others
- Create [DependencyHandler](handler/dependency-handler.md) to build the dependencies tree
- Create [InstanceHandler](handler/instance-handler.md) to build the instances
- Create [FileHandler](handler/file-handler.md) to scan the folders(of your project) and import these classes decorated with [Core Decorators](decorator/core-decorators.md). This FileHandler will be changed in future release to compose the build process(will be handled in "The Way CI") and not the running process with the Core.

When Started:

- CoreState change: From [WAITING](shared/enum/core-state-enum.md#WAITING) to [BEFORE_INITIALIZATION_STARTED](shared/enum/core-state-enum.md#BEFORE_INITIALIZATION_STARTED)

When Finished:

- CoreState change: From [BEFORE_INITIALIZATION_STARTED](shared/enum/core-state-enum.md#BEFORE_INITIALIZATION_STARTED) to [BEFORE_INITIALIZATION_DONE](shared/enum/core-state-enum.md#BEFORE_INITIALIZATION_DONE)
- The [PropertiesHandler](handler/properties-handler.md) can be [injected](decorator/core-decorators.md#inject), retrieved with [getInstanceByName](#method-static-getinstancebyname) or [getPropertiesHandler](#method-static-getpropertieshandler)


### Step: Initialization

This is the second step and is activated when the current value of the CoreState is [BEFORE_INITIALIZATION_DONE](shared/enum/core-state-enum.md#BEFORE_INITIALIZATION_DONE).

Is responsible for:

- Build the Dependencies Tree
- All registered classes decorated with [@Configuration](decorator/core-decorators.md#configuration) and extended with [Configurable](shared/abstract/configurable.md) will be Configured
- All registered classes via [Core Decorators](decorator/core-decorators.md) and [Register Handler](handler/register-handler.md) will be built
- When the server is enabled, the [Server Configuration](configuration/server-configuration.md) will be configured and the registered paths with the [Rest Decorators](decorator/rest-decorators.md) will be bind.

When Started:

- CoreState change: from [BEFORE_INITIALIZATION_DONE](shared/enum/core-state-enum.md#BEFORE_INITIALIZATION_DONE) to [INITIALIZATION_STARTED](shared/enum/core-state-enum.md#initialization_started)

When Finished:

- CoreState change: from [INITIALIZATION_STARTED](shared/enum/core-state-enum.md#INITIALIZATION_STARTED) to [INITIALIZATION_DONE](shared/enum/core-state-enum.md#INITIALIZATION_DONE)
- All classes mapped with the [Core Decorators](decorator/core-decorators.md), can be Injected
- All classes decorated with [@Configuration](decorator/core-decorators.md#configuration) and is extended with [Configurable](shared/abstract/configurable.md), are configured
- All classes that are extended with [Destroyable](shared/abstract/destroyable.md), will be destroyed when the Core step change to [destruction](#step-destruction)
- When server is enabled, the Http and/or Https can be accessed, and the rest operations is bind and accessible.

### Step: After Initialization

This is the second step and is activated when the current value of the CoreState is [INITIALIZATION_DONE](shared/enum/core-state-enum.md#INITIALIZATION_DONE).

Is responsible for:

- Mark the CoreState as [READY](shared/enum/core-state-enum.md#READY)

When Finished:

- CoreState change: from [INITIALIZATION_DONE](shared/enum/core-state-enum.md#INITIALIZATION_DONE) to [READY](shared/enum/core-state-enum.md#READY)

### Step: Destruction

This is the destruction step and is activated when is called the method [destroy()](#method-static-destroy) or occurs an error in the initialization steps.

Is responsible for:

- Destroy the core
- Destroy all classes instances that extends the [destroyable](shared/abstract/destroyable.md) class
- Will terminate the node process if the property the-way.core.process-exit is true (see [properties](application-properties.md))

When Started:

- CoreState change: from [Any Core State](shared/enum/core-state-enum.md) to [DESTRUCTION_STARTED](shared/enum/core-state-enum.md#destruction_started)

When Finished:

- CoreState change: from [DESTRUCTION_STARTED](shared/enum/core-state-enum.md#DESTRUCTION_STARTED) to [DESTRUCTION_DONE](shared/enum/core-state-enum.md#destruction_done)

### Method: static createCore

This method is called in @Application or in TheWayApplication Constructor.
This method tell to the CORE to initialize the application.

#### Params

- *application*: Can be a Class or Instance of a class. This parameter will be used
  to set the application instance. After the initialization,
  the [method start](documentation/the-way/core/the-way-application.md#method-start) of TheWayApplication will be called.

### Method: static destroy

This method can be called in any stage of the Core. When called, the Core
will start the process to destroy the instances, configurations and connections.

#### Return

- Returns an observable that will emit value when the construction step is done,
  or an error occurs in the destruction step

### Method: static getConstructors

This method will access the [register handler](documentation/the-way/core/handler/register-handler.md) and get all the constructions registered

#### Return

 - Returns all registered constructors: [ConstructorMapModel](documentation/the-way/core/shared/model/constructor-map-model.md)

### Method: static getCoreState

Retrieves the current Core State

#### Return

 - Actual state: [CoreStateEnum](documentation/the-way/core/shared/enum/core-state-enum.md)

### Method: static getDependenciesTree

Retrieves the dependencies tree of the application

#### Return

 - The built dependencies tree: [DependencyTreeModel](documentation/the-way/core/shared/model/dependency-tree-model.md)

### Method: static getInstanceByName

Retrieve the class singleton by name class

#### Params

 - *name*: The class name

Throws:

 - *ApplicationException*: If the wanted instance is not found

#### Return

 - The instance of the class: T

### Method: static getInstances

Retrieve all instances

#### Return

 - An array of the instances

### Method: static getOverrides

Retrieve all overridden classes

#### Return

 - The overridden map: [OverriddenMapModel](documentation/the-way/core/shared/model/overridden-map-model.md)

### Method: static getPropertiesHandler

Will return the PropertiesHandler of the application

#### Return

 - The propertiesHandler: [PropertiesHandler](documentation/the-way/core/handler/properties-handler.md)

### Method: static isDestroyed

Will check if the core is destroyed

#### Return

 - A boolean, that will be true when the Core is destroyed

### Method: static registerConfiguration

This method will register a class decorated with [@Configuration](decorator/core-decorators.md#configuration). For Core use only

#### Params

 - *configurationConstructor*: The decorated class
 - *over* The class that must be overridden. It is optional

### Method: static registerCoreComponent

This method will register a core component. For Core use only

#### Params

 - *componentConstructor*: The Core Component class

### Method: static registerInjection

This method will register a dependency and map injection point

#### Params

 - *dependencyConstructor*: The dependency class
 - *source*: The dependent class
 - *propertyKey*: The dependent class injection point

### Method: static registerRest

This is method is used to register a class decorated with [@Rest](decorator/core-decorators.md#rest)

#### Params

- *restConstructor*: Is the class decorated with [@Rest](decorator/core-decorators.md#rest)
- *path*: The father path. All method decorated with [Rest Decorators](decorator/rest-decorators.md) will inherit this path
- *authenticated*: When true, all inherit paths need a user signed in
- *allowedProfiles*: Is the allowed profiles that can execute the operations mapped in the methods decorated with some [rest decorator](decorator/rest-decorators.md)

### Method: static registerRestPath

This is method is used to register a REST operation in methods decorated with some [Rest Decorators](decorator/rest-decorators.md)

#### Params

 - *httpType*: Is the [HttpTypeEnum](shared/enum/http-type-enum.md) (Get, Post, Delete, ...)
 - *path*: Is the operation PATH
 - *target*: Is the method class
 - *methodName*: Is the method name
 - *authenticated*: When true, the mapped operation will be executed only if has a user authenticated
 - *allowedProfiles*: Is the allowed profiles that can execute the operation

### Method: static registerService

This method will register a class decorated with ´[@Service](decorator/core-decorators.md#service). For Core use only

#### Params

- *serviceConstructor*: The decorated class
- *over* The class that must be overridden. It is optional

### Method: static setError

When this method is called, the destruction step will start, and the ERROR will be registered

Param:

 - *error*: Is the error that will be registered in the core

### Method: static whenBeforeInitializationIsDone

This method return an observable that will emit value when the core assumes the state of [BEFORE_INITIALIZATION_DONE](#step-before-initialization)

#### Return

 - Observable<CoreStateEnum>

### Method: static whenDestroyed

This method return an observable that will emit value when the core assumes the state of [DESTRUCTION_DONE](#step-destruction)

#### Return

- Observable<CoreStateEnum>

### Method: static whenReady

This method return an observable that will emit value when the core assumes the state of [READY](shared/enum/core-state-enum.md#ready)

#### Return

- Observable<CoreStateEnum>

### Method: static watchState

This method will return an observable that will emit every change of the core state

#### Return

- Observable<CoreStateEnum>




