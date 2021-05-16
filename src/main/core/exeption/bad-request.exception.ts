import { RestException } from './rest.exception';
import { CoreMessageService } from '../service/core-message.service';
import { HttpCodesEnum } from '../shared/enum/http-codes.enum';

/**
 *   @name BadRequestException
 *   This exception should be thrown when the expected request is different from the one passed
 *   @param code by default is HttpCodesEnum.BadRequest.
 *   @param detail is the error detail
 *   @param description is the error summary
 *   @since 1.0.0
 */
export class BadRequestException extends RestException {
    constructor(
        public detail: string, public code = HttpCodesEnum.BadRequest,
        public description = CoreMessageService.getMessage('http-bad-request')
    ) {
        super(code, detail, description);
    }
}
