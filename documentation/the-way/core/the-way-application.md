[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/service/core-rest.service.ts)

## The Way Application

TheWayApplication class is fundamental to work with TheWay framework.
To use this framework you must have a class decorated with [@Application](documentation/the-way/core/decorator/application-components-decorators.md#application) and extended with TheWayApplication.
When you pass to the @Application false, the core will not start automatically,
but when you instantiate your main class(decorated and extended with TheWayApplication), TheWayApplication constructor will call the Core to initialize the application.

### Summary

 - [Method: start](#method-start)

### Method: start

When the [CORE is initialized](documentation/the-way/core/core.md#step-after-initialization), this method will be called. The default implementation is empty,
and you can customize this method into your class that extends TheWayApplication to execute something.