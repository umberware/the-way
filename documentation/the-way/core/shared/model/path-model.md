[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/shared/model/path.model.ts)

## PathModel

This interface is used to register a REST path. The registered paths are used in [CoreRestService](documentation/the-way/core/service/core-rest-service.md)

Properties:

 - *allowedProfiles*: Is an Array of PROFILES. This profiles will be used to determine if the logged user can access the PATH
 - *isAuthenticated*: Tell to [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) if the operation must have a logged user and valid
 - *path*: Is the path for the operation
 - *target*: Represent the class constructor that will be bound with the operation
 - *propertyKey*: Is the target/method that will be bound with the operation
 - *type*: Is the HTTP Method (Post, Get, Delete ...). See [HttpTypeEnum](documentation/the-way/core/shared/enum/http-type-enum.md)