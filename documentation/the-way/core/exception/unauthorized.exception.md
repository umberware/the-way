## UnauthorizedException

This exception should be thrown when an user try to use a rest operation without authorization.

Params:

 - *code*: code by default is HttpCodesEnum.Unauthorized. See [HttpCodes](../shared/enum/http-code-enum.md)
 - *detail*: is the error detail
 - *description* is the error summary