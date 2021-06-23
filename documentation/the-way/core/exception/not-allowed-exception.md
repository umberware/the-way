[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/exeption/not-allowed.exception.ts)

## NotAllowedException

This exception should be thrown when the user has a valid token but not a allowed profile.

Params:

 - *code*: code by default is HttpCodesEnum.Forbidden. See [HttpCodes](../shared/enum/http-code-enum.md)
 - *detail*: is the error detail
 - *description* is the error summary