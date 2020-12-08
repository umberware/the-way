import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';
import { Messages } from '../model/messages';

export class UnauthorizedException extends ApplicationException {
    constructor(message: string) {
        super(message, Messages['not-authorized'], ErrorCodeEnum.UNAUTHORIZED);
    }
}
