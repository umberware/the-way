import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from '../model/error-code.enum';

export class NotFoundException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Not Found', ErrorCodeEnum.NOT_FOUND);
    }
}