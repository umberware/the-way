[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/exeption/not-found.exception.ts)

## NotFoundException

This exception should be thrown when a requested resource is not found.

Params:

 - *code*: code by default is HttpCodesEnum.NotFound. See [HttpCodes](../shared/enum/http-code-enum.md)
 - *detail*: is the error detail
 - *description* is the error summary