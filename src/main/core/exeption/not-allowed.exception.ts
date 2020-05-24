import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from '../model/error-code.enum';

export class NotAllowedException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Not Authorized', ErrorCodeEnum.NOT_ALLOWED);
    }
}