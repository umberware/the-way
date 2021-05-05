import { RestException } from './rest.exception';
import { CoreMessageService } from '../service/core-message.service';
import { HttpCodesEnum } from '../shared/enum/http-codes.enum';

/**
 *   @name NotAllowedException
 *   This exception should be thrown when the user has a valid token but not a allowed profile.
 *   @param code by default is HttpCodesEnum.Forbidden.
 *   @param detail is the error detail
 *   @param description is the error summary
 *   @since 1.0.0
 */
export class NotAllowedException extends RestException {
    constructor(
        public detail: string, public code = HttpCodesEnum.Forbidden,
        public description = CoreMessageService.getMessage('http-not-allowed')
    ) {
        super(code, detail, description);
    }
}
