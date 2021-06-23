[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/service/core-rest.service.ts)

## CoreRestService

The role of this class is to handle the REST operations, providing security (via JWT, can be customized with custom CoreSecurityService), error handling, execution and others.
Also, it's important to know that all mapped REST operation, when executed(called via HTTP), the return of the method/function will be the return to the requester, and the return can has the types:

 - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
 - [RxJs Observable](https://rxjs.dev/api/index/class/Observabl)
 - or a not "async" type like a custom JSON, string, integer and others

### Summary

 - [Method: registerPath](#method-registerpath)

### Method: registerPath

This method is used to register a REST operation, mapping the path and the method that will be called when a HTTP request is received under the path.

When the [Core](documentation/the-way/core/core.md) is initialized, for every path registered in the [RegisterHandler](documentation/the-way/core/handler/register-handler.md#method-registerrestpath) this method will be called

Params:

 - *httpType*: is the HttpTypeEnum(Http method: Post, Get, ...)
 - *path*: is the endpoint that you will serve the operation
 - *target*: is the class decorated with @Rest for this operation
 - *methodName*: is the name of the method in the target class that will be called when a request under the path is received
 - *fatherPath*: when a class decorated with @Rest has a declared path in the decorator
 - *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](documentation/the-way/core/service/core-security-service.md)
 - *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.