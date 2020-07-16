import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';
import { MessagesEnum } from '../model/messages.enum';

export class UnauthorizedException extends ApplicationException {
    constructor(message: string) {
        super(message, MessagesEnum['not-authorized'], ErrorCodeEnum.UNAUTHORIZED);
    }
}
