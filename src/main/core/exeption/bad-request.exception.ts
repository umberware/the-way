import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';
import { Messages } from '../model/messages';

export class BadRequestException extends ApplicationException {
    constructor(message: string) {
        super(message, Messages['bad-request'], ErrorCodeEnum.BAD_REQUEST);
    }
}
