import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';

export class NotFoundException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Not Found', ErrorCodeEnum.NOT_FOUND);
    }
}