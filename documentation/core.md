## Core

The core is the heart and brain of this library. It controls all stages of the application in 4 major steps.

### Summary

 - [Decorator @Application and Core](#decorator-application-and-core)
 - [Core States](#core-states)
 - [Step: Before Initialization](#step-before-initialization)
 - [Step: Initialization](#step-before-initialization)
 - [Step: After Initialization](#step-before-initialization)
 - [Step: Destruction](#step-destruction)

### Decorator @Application and Core

The [@Application](./components/core-decorators.md#application) and [TheWayApplication](./components/the-way-application.md) are primordial to use this library.
When a CoreInstance is created, the initialization step will initialize. The Core steps will be described in the subsequent sections.

A CoreInstance is created when:

 - A class decorated with [@Application](./components/core-decorators.md#application) with no parameters or with the parameter automatic = true and extends the class [TheWayApplication](./components/the-way-application.md)
 - A class decorated with [@Application](./components/core-decorators.md#application) with the parameter automatic = false, is extended with [TheWayApplication](./components/the-way-application.md) and the new is called

So, it's automatic or manually called.

*Automatic: @Application with no parameters and a class extended with TheWayApplication class*

    import { Application, TheWayApplication } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {}

**The above example, the application will start automatically**


*Manually: @Application with parameter automatic with the value false, and a class extended with TheWayApplication class*

    import { Application, TheWayApplication } from '@umberware/the-way';

    @Application({
        automatic: false
    })
    export class Main extends TheWayApplication {}

    ...

     new Main();

**In the example above, the application will start when the main class is created**

### Core States

The Core has a method that return an Observable from [rxjs](https://rxjs-dev.firebaseapp.com/) and this observable will return via .subscribe the current CoreState of the Core.
When the Core State change, the observable will emit this new value.
The values of this observable/CoreState has the type [CoreStateEnum](./components/core-state-enum.md) and the Core first state is [WAITING](./components/core-state-enum.md#WAITING)

### Step: Before Initialization

This is the first step and is activated when the Core Instance is created.

Is responsible for:

- Read the application.properties.yml with [PropertiesHandler](./components/properties-handler.md)
- Create [RegisterHandler](./components/register-handler.md) and prepare to register paths, classes and others
- Create [DependencyHandler](./components/dependency-handler.md) to build the dependencies tree
- Create [InstanceHandler](./components/instance-handler.md) to build the instances
- Create [FileHandler](./components/file-handler.md) to scan the folders(of your project) and import these classes decorated with [Core Decorators](./components/core-decorators.md). This FileHandler will be changed in future release to compose the build process in a "The Way CI" and not the running process with the Core.

When Started:

 - CoreState change: From [WAITING](./components/core-state-enum.md#WAITING) to [BEFORE_INITIALIZATION_STARTED](./components/core-state-enum.md#BEFORE_INITIALIZATION_STARTED)

When Finished:

 - CoreState change: From [BEFORE_INITIALIZATION_STARTED](./components/core-state-enum.md#BEFORE_INITIALIZATION_STARTED) to [BEFORE_INITIALIZATION_DONE](./components/core-state-enum.md#BEFORE_INITIALIZATION_DONE)
 - The [PropertiesHandler](./components/properties-handler.md) can be [injected](./components/core-decorators.md#inject), retrieved with [getInstanceByName](#coregetinstancebyname) or [getPropertiesHandler](#coregetpropertieshandler)


### Step: Initialization

This is the second step and is activated when the current value of the CoreState is [BEFORE_INITIALIZATION_DONE](./components/core-state-enum.md#BEFORE_INITIALIZATION_DONE).

Is responsible for:

 - Build the Dependencies Tree
 - All registered classes decorated with [@Configuration](./components/core-decorators.md#configuration) and extended with [Configurable](./components/configurable.md) will be Configured
 - All registered classes via [Core Decorators](./components/core-decorators.md) and [Register Handler](./components/register-handler.md) will be built
 - When the server is enabled, the [Server Configuration](./components/server-configuration.md) will be configured and the registered paths with the [Rest Decorators](./components/rest-decorators.md) will be bind.

When Started:

  - CoreState change: from [BEFORE_INITIALIZATION_DONE](./components/core-state-enum.md#BEFORE_INITIALIZATION_DONE) to [INITIALIZATION_STARTED](./components/core-state-enum.md#initialization_started)

When Finished:

  - CoreState change: from [INITIALIZATION_STARTED](./components/core-state-enum.md#INITIALIZATION_STARTED) to [INITIALIZATION_DONE](./components/core-state-enum.md#INITIALIZATION_DONE)
  - All classes mapped with the [Core Decorators](./components/core-decorators.md), can be Injected
  - All classes decorated with [@Configuration](./components/core-decorators.md#configuration) and is extended with [Configurable](./components/configurable.md), are configured
  - All classes that are extended with [Destroyable](./components/destroyable.md), will be destroyed when the Core step change to [destruction](#step-desctruction)
  - When server is enabled, the Http and/or Https can be accessed, and the rest operations is bind and accessible.

### Step: After Initialization

This is the second step and is activated when the current value of the CoreState is [INITIALIZATION_DONE](./components/core-state-enum.md#INITIALIZATION_DONE).

Is responsible for:

 - Mark the CoreState to [READY](./components/core-state-enum.md#READY)

When Finished:

- CoreState change: from [INITIALIZATION_DONE](./components/core-state-enum.md#INITIALIZATION_DONE) to [READY](./components/core-state-enum.md#READY)

### Step: Destruction

This is the destruction step and is activated when is called the method [destroy()](#coredestroy) or occurs an error in the initialization steps.

Is responsible for:

- Destroy the core
- Destroy all classes instances that extends the [destroyable](./components/destroyable.md) class
- Will terminate the node process if the property the-way.core.process-exit is true (see [properties](./application-properties.md))

When Started:

- CoreState change: from [Any Core State](./components/core-state-enum.md) to [DESTRUCTION_STARTED](./components/core-state-enum.md#destruction_started)

When Finished:

- CoreState change: from [DESTRUCTION_STARTED](./components/core-state-enum.md#DESTRUCTION_STARTED) to [DESTRUCTION_DONE](./components/core-state-enum.md#destruction_done)

### Core.destroy

### Core.getInstanceByName

### Core.getPropertiesHandler

### Core.watchState

### Core.whenDestroyed



