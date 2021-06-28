[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/handler/register.handler.ts)

## RegisterHandler

The RegisterHandler will store all "components" that must be handled in the Core.
All injections, services, configurations, rest, overrides, will be registered to be handled in the Core.

### Summary

 - [Method: bindPaths](#method-bindpaths)
 - [Method: getComponents](#method-getcomponents)
 - [Method: getConfigurables](#method-getconfigurables)
 - [Method: getConstructor](#method-getconstructor)
 - [Method: getCoreComponents](#method-getconstructor)
 - [Method: getDependencies](#method-getdependencies)
 - [Method: getDependency](#method-getdependency)
 - [Method: getDestroyable](#method-getdestroyable)
 - [Method: getOverridden](#method-getoverridden)
 - [Method: getRestMap](#method-getrestmap)
 - [Method: registerConfiguration](#method-registerconfiguration)
 - [Method: registerCoreComponent](#method-registercorecomponent)
 - [Method: registerDestroyable](#method-registerdestroyable)
 - [Method: registerInjection](#method-registerinjection)
 - [Method: registerRest](#method-registerrest)
 - [Method: registerRestPath](#method-registerrestpath)
 - [Method: registerService](#method-registerservice)

### Method: bindPaths

This method will register all registered [@Rest](documentation/the-way/core/decorator/core-decorators.md#rest) classes and ["rest operations"](documentation/the-way/core/decorator/rest-decorators.md) into the [CoreRestService](documentation/the-way/core/service/core-rest-service.md)

### Method: getComponents

To get the registered components (Without the CoreComponents)

#### Return

 - The registered components: [ConstructorMapModel](documentation/the-way/core/shared/model/constructor-map-model.md)

### Method: getConfigurables

Returns all registered classes that are [Configurable](documentation/the-way/core/shared/abstract/configurable.md)

#### Return

 - A Set of [Configurable](documentation/the-way/core/shared/abstract/configurable.md)

### Method: getConstructor

Will return the registered Constructor of a class.
If a class is overridden, the return will be the substitute class.

#### Params

 - *name*: With type string, is the name of the class.


#### Return

 - The registered Constructor: [ConstructorModel](documentation/the-way/core/shared/model/constructor-model.md)

### Method: getCoreComponents

Will return all registered Core Constructors.

#### Return

 - The registered CoreComponents: [ConstructorMapModel](documentation/the-way/core/shared/model/constructor-map-model.md)

### Method: getDependencies

To get all registered dependencies

#### Return

- The Dependencies: [DependencyMapModel](documentation/the-way/core/shared/model/dependency-map-model.md) structure

### Method: getDependency

To get a registered dependency

Param:

 - *dependent*: The dependent name class
 - *dependency*: The dependency name class

#### Return

- The dependency: [DependencyModel](documentation/the-way/core/shared/model/dependency-model.md)

### Method: getDestroyable

Get all classes registered to be destroyed (when Core assume [destruction state](documentation/the-way/core/core.md#step-destruction))

#### Return

 - A Set of [Destroyable](documentation/the-way/core/shared/abstract/destroyable.md)

### Method: getOverridden

Retrieves the registered classes overrides

#### Return

 - Overrides: [OverriddenMapModel](documentation/the-way/core/shared/model/overridden-map-model.md)

### Method: getRestMap

Will return the registered 'PATHS' for a given class

#### Params

 - *name*: is the class name

#### Return

 - The registered [PathMapModel](documentation/the-way/core/shared/model/path-map-model.md) to the class

### Method: registerConfiguration

This method is used to register a class decorated with [@Configuration](documentation/the-way/core/decorator/core-decorators.md#configuration)

#### Params

 - *constructor*: Is the class constructor
 - *over*: is the class that will be replaced

### Method: registerCoreComponent

To Core use only, this method will register a CoreComponent

#### Params

- *constructor*: Is the class constructor

### Method: registerDestroyable

Will register an instance that must be destroyed when Core assume the Destruction step.

#### Params

 - *instance*: An instance of [Destroyable](documentation/the-way/core/shared/abstract/destroyable.md)

### Method: registerInjection

This method is used to register a class dependency([@Inject](documentation/the-way/core/decorator/core-decorators.md#inject))

#### Params

 - *dependencyConstructor*: Is the dependency constructor
 - *target*: The dependent class
 - *propertyKey*: The property in the dependent that will be injected the dependency

### Method: registerRest

This method is used to register a [@Rest](documentation/the-way/core/decorator/core-decorators.md#rest) class

#### Params

 - *constructor*: Is the class constructor
 - *path*: Is the 'father' path to be registered
 - *isAuthenticated*: If the endpoint can only be executed to a logged user
 - *allowedProfiles*: When the endpoint need a user logged, and a user with a certain profile

### Method: registerRestPath

This method is used to register a [REST operation](documentation/the-way/core/decorator/rest-decorators.md)

#### Params

- *type*: Is the HttpType of the operation
- *path*: Is the 'father' path to be registered
- *target*: Is the class that will be bind the execution
- *propertyKey*: The method that will be called when the server receives the operation
- *isAuthenticated*: If the endpoint can only be executed to a logged user
- *allowedProfiles*: When the endpoint need a user logged, and a user with a certain profile

### Method: registerService

This method is used to register a class decorated with [@Service](documentation/the-way/core/decorator/core-decorators.md#service)

#### Params

- *constructor*: Is the class constructor
- *over*: is the class that will be replaced