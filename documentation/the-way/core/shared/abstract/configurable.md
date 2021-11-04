[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/shared/abstract/configurable.ts)

## Configurable

This abstract class can be used to autoconfigure an object instance
When a class extends Configurable and is registered in the Core,
when the core instantiates the class, the method: configure, will be called

Also, this class extends the [destroyable](documentation/the-way/core/shared/abstract/destroyable.md) class

### Summary

- [Method: configure](#method-configure)

### Method: configure

This method is designed to be called when the Core instantiate a class,
so if you need start a connection, prepare something for your application or configure, this method is for it

#### Return

- The return of this method can be a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [RxJs Observable](https://rxjs.dev/api/index/class/Observabl) or all not "async" types

### Method: destroy

This method is designed to be called before destruction, so if you need to save, clean up or disconnect from another service, this method is for it

#### Return

- The return of this method can be a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [RxJs Observable](https://rxjs.dev/api/index/class/Observabl) or all not "async" types