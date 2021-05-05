import { ApplicationException } from './application.exception';
import { HttpCodesEnum } from '../shared/enum/http-codes.enum';

/**
 *   @name RestException
 *   The 'primitive' rest exception.
 *   @param code is the HTTP code for the exception
 *   @param detail is the error detail
 *   @param description is the error summary
 *   @since 1.0.0
 */
export class RestException extends ApplicationException {
    constructor(public code: HttpCodesEnum, public detail: string, public description: string) {
        super(detail, description);
    }
}
