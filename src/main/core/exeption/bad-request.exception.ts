import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';
import { MessagesEnum } from '../model/messages.enum';

export class BadRequestException extends ApplicationException {
    constructor(message: string) {
        super(message, MessagesEnum['bad-request'], ErrorCodeEnum.BAD_REQUEST);
    }
}