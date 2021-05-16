import { RestException } from './rest.exception';
import { CoreMessageService } from '../service/core-message.service';
import { HttpCodesEnum } from '../shared/enum/http-codes.enum';

/**
 *   @name InternalException
 *   This exception should be thrown when an unexpected error occurs.
 *   @param code by default is HttpCodesEnum.InternalServerError.
 *   @param detail is the error detail
 *   @param description is the error summary
 *   @since 1.0.0
 */
export class InternalException extends RestException {
    constructor(
        public detail: string, public code = HttpCodesEnum.InternalServerError,
        public description = CoreMessageService.getMessage('http-internal-server-error')
    ) {
        super(code, detail, description);
    }
}
