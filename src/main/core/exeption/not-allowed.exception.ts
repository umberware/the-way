import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';

export class NotAllowedException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Not Authorized', ErrorCodeEnum.NOT_ALLOWED);
    }
}