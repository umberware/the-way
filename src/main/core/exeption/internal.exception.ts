import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from '../model/error-code.enum';

export class InternalException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Internal Error', ErrorCodeEnum.BAD_REQUEST);
    }
}
