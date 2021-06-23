[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/handler/instance.handler.ts)

## InstanceHandler

InstanceHandler is responsible to create the instances, resolve the dependencies tree, configure and destroy instances.

### Summary

 - [Method: buildApplication](#method-buildapplication)
 - [Method: buildInstance](#method-buildinstance)
 - [Method: buildInstances](#method-buildinstances)
 - [Method: destroy](#method-destroy)
 - [Method: getInstanceByName](#method-getinstancebyname)
 - [Method: getInstances](#method-getinstances)
 - [Method: registerInstance](#method-registerinstance)

### Method: buildApplication

This method will create an instance of the class decorated with [@Application](documentation/the-way/core/decorator/core-decorators.md).
To [Core](documentation/the-way/core/core.md) use only.

Params:

 - *constructor*: With type *Function*, is the constructor of the main application class.

Return:
 - *instance*: Is the instance created.

### Method: buildInstance

Will create or retrieve an instance of a constructor.
If the constructor was override, will be returned the overridden class instance.
If the class extends the [Destroyable](documentation/the-way/core/shared/abstract/destroyable.md), this instance will be registered to be destroyed when the
[Core](documentation/the-way/core/core.md#step-destruction) assume the destruction state.

Params:
 - *constructor*:  With type Function, is the constructor of the class

Return:
 - \[instance, boolean\], will return an array with instance in first index, and a boolean flag in the second index.
 The boolean flag will be false when an instance is created and true when has an instance

### Method: buildInstances

This method will resolve the dependencies tree, create all the instances registered and configure the classes that extends the [Configurable](documentation/the-way/core/shared/abstract/configurable.md). [Core](documentation/the-way/core/core.md) only.

Params:

 - *mainConstructor*: With type Function, is the constructor of the main class.
 - *dependencyTree*: is the dependency tree created in [DependencyHandler](dependency-handler.md).

Return:

 - *Observable<boolean>*: emits true when all instances were created and configured.

### Method: destroy

Will destroy all instances that extends [Destroyable](documentation/the-way/core/shared/abstract/destroyable.md)

Return:

 - Observable<boolean>: emits true when all instances are destroyed.

### Method: getInstanceByName

Will return the wanted class instance.

Params:

 - *name*: With type string, is the class name of the wanted instance. When not found, an exception will be thrown.

Return:

 - The wanted instance.

### Method: getInstances

This method will return all created instances.

Return:

- All instances

### Method: registerInstance

Will register an instance

Return:

- The class instance