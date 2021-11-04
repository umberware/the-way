[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/shared/model/path-map.model.ts)

## PathMapModel

This interface is used to register a REST path for classes decorated with [@Rest](documentation/the-way/core/decorator/application-components-decorators.md#rest).
Also, will store the nested REST operations inside the class.

Properties:

- *allowedProfiles*: Is an Array of PROFILES. This profiles will be used to determine if the logged user can access the PATH
- *childrenPath*: Is an Array of the nested REST operations inside the class ([PathModel](path-model.md))
- *fatherPath*: This path will be concated with the nested paths
- *inContext*: Will be true when the method decorated to be a [Rest Operation](documentation/the-way/core/decorator/rest-decorators.md) operation is in a class decorated with @Rest
- *isAuthenticated*: Tell to [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) if the operation must have a logged user and valid.
