import { RestException } from './rest.exception';
import { CoreMessageService } from '../service/core-message.service';
import { HttpCodesEnum } from '../shared/enum/http-codes.enum';

/**
 *   @name NotFoundException
 *   This exception should be thrown when a requested resource is not found.
 *   @param code by default is HttpCodesEnum.NotFound.
 *   @param detail is the error detail
 *   @param description is the error summary
 *   @since 1.0.0
 */
export class NotFoundException extends RestException {
    constructor(
        public detail: string, public code = HttpCodesEnum.NotFound,
        public description = CoreMessageService.getMessage('http-not-found')
    ) {
        super(code, detail, description);
    }
}
