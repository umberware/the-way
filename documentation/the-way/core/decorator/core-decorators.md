## Core Decorators

In this section we will explain the main decorators of this library and their purposes.
For rest decorators you can access the [documentation](./rest-decorators.md) specific to this theme.

### Summary

 - [@Application](#application)
 - [@Service](#service)
 - [@Configuration](#configuration)
 - [@Rest](#rest)
 - [@Inject](#inject)
 - [@System](#system)

### Application
The @Application is the main decorator to use this library, and their goal is make the Core Sub Process ready to start the application.

#### Where to use it

 - In your Main Class

#### Params

 - *automatic*: this parameter when true, will tell Core to automatically start your application, creating the dependency tree, instances, injections, services and configurations.
   When false, the Core will start your application when you create an instance of your class decorated with @Application and extended with [TheWayApplication](../the-way-application.md).
   By default, is true.

### Service
The @Service is a Core decorator that allow you to register a class with a service scope.
Furthermore, the @Service decorator allow you to override another service.

#### Where to use it

 - When a class scope is a service, the @Service can be used.

#### Params

 - *over*: You can pass the class that will be replaced. When a class is replaced, all injection points that use that class will have an instance of the new class

### Configuration
The @Configuration is a Core decorator that allow your application to register configurable classes and configure these classes.
Classes with this decorator and that extend the [Configurable](../shared/abstract/configurable.md), will be called the method **configure** after the instance creation. Also, the **destroy** method will be called when the core is in destruction step.
Furthermore, the @Configuration decorator allow you to override another configurable class.

#### Where to use it

- When the target class must be configured or is a configuration scope

#### Params

- *over*: You can pass the class that will be replaced. When a class is replaced, all injection points that use that class will have an instance of the replacer

### Rest
The @Rest is a Core decorator that allow you to register REST classes.
Classes with this decorator, will have the REST scope and can be used to register operations in REST concept. Also, you can pass a father "path".

#### Where to use it

 - In all classes that will be a REST component

#### Params

 - *path*: When is given a path, in the @Rest decorator, all the descendent REST operations with the [rest decorators](./rest-decorators.md) will inherit the path.

### Inject

The @Inject decorator, allow your application to automatically get an instance of a class. Is not necessary that wanted class is decorated with a Core Decorator.
It's important to know that the injected class will be a singleton (only one instance for all injections).

#### Where to use it

 - When your class, has a dependency with another class

### System

The @System decorator is for CORE only.
