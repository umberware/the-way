[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/shared/abstract/destroyable.ts)

## Destroyable

This abstract class can be used to auto destroy an object instance. When a class
extends Destroyable and is registered in the [Core](documentation/the-way/core/core.md),
when the core assumes the [destruction state](documentation/the-way/core/core.md#step-destruction)
the Core will call for every class that extends Destroyable the [method: destroy](#method-destroy).

### Summary

 - [Method: destroy](#method-destroy)

### Method: Destroy

This method is designed to be called before destruction, so if you need to save, clean up or disconnect from another service, this method is for it

#### Return

 - The return of this method can be a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [RxJs Observable](https://rxjs.dev/api/index/class/Observabl) or all not "async" types