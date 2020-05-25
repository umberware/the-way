import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';

export class BadRequestException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Invalid Request', ErrorCodeEnum.BAD_REQUEST);
    }
}