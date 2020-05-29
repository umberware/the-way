import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';
import { MessagesEnum } from '../model/messages.enum';

export class InternalException extends ApplicationException {
    constructor(message: string) {
        super(message, MessagesEnum['internal-server-error'], ErrorCodeEnum.BAD_REQUEST);
    }
}
