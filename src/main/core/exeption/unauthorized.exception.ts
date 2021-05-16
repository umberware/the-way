import { RestException } from './rest.exception';
import { CoreMessageService } from '../service/core-message.service';
import { HttpCodesEnum } from '../shared/enum/http-codes.enum';

/**
 *   @name UnauthorizedException
 *   This exception should be thrown when an user try to use a rest operation without authorization.
 *   @param code by default is HttpCodesEnum.Unauthorized.
 *   @param detail is the error detail
 *   @param description is the error summary
 *   @since 1.0.0
 */
export class UnauthorizedException extends RestException {
    constructor(
        public detail: string, public code = HttpCodesEnum.Unauthorized,
        public description = CoreMessageService.getMessage('http-not-authorized')
    ) {
        super(code, detail, description);
    }
}
