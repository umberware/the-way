## NotAllowedException

This exception should be thrown when the user has a valid token but not a allowed profile.

Params:

 - *code*: code by default is HttpCodesEnum.Forbidden. See [HttpCodes](../shared/enum/http-code-enum.md)
 - *detail*: is the error detail
 - *description* is the error summary