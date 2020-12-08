import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';
import { Messages } from '../model/messages';

export class InternalException extends ApplicationException {
    constructor(message: string) {
        super(message, Messages['internal-server-error'], ErrorCodeEnum.INTERNAL_SERVER_ERROR);
    }
}
