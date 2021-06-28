[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/exeption/bad-request.exception.ts)

## BadRequestException

This exception should be thrown when the expected request is different from the request received.

#### Params

 - *code*: code by default is HttpCodesEnum.BadRequest. See [HttpCodes](../shared/enum/http-code-enum.md)
 - *detail*: is the error detail
 - *description* is the error summary