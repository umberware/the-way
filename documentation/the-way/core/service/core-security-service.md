[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/service/core-security.service.ts)

## CoreSecurityService

With an embedded JWT mechanism, this class is responsible to verify the user authenticity or generate the user authenticity. All paths marked with "true" in the "authenticated" param, will call this class
to verify the user authenticity. The generation of the user authenticity(with JWT token), is triggered manually
and you can check how do to this in the guide [The Way: Custom Security Service](https://github.com/umberware/the-way/blob/master/documentation/guides/the-way-custom-security-service.md)
or in the [source code](https://github.com/umberware/the-way-examples/tree/master/examples/custom-security-rest/).
It's important to know that these behaviors can be customized/overridden with a custom CoreSecurityService, so you can change the default JWT engine to an OAUTH 2.0 for example


**You can check the [The Way: Custom Security Service](documentation/guides/the-way-custom-security-service.md) guide to implement a custom CoreSecurityService**

### Summary

 - [Method: generateToken](#method-generatetoken)
 - [Method: verifyAuthentication](#method-verifyauthentication)

### Method: generateToken

This method is used to generate a JWT token to provide the user authenticity.
The default implementation, uses the `the-way.server.rest.security` properties and you must change the keys if you want to use the default implementation. Actually, we use the
library [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken) to provide and verify the JWT token.

#### Params

 - *tokenClaims*: Is a JSON object with the information that will be a part of the token.
   [TokenClaims](documentation/the-way/core/shared/model/token-claims-model.md) is encrypted with aes-256-cbc.

#### Return

 - The resultant JWT token

### Method: verifyAuthentication

This method will check if the logged user can access the path, evaluating the token and the profiles in the token claims

#### Params

 - *token*: is the logged user token
 - *fatherPathProfiles*: is an array of profiles allowed to use the operations
   inside a father path
 - *profiles*: is an array of profiles allowed to use the current operation(path)

#### Return

 The return of the verification is the [TokenClaims](documentation/the-way/core/shared/model/token-claims-model.md) decrypted from the token