import { ApplicationException } from './application.exception';
import { ErrorCodeEnum } from './error-code.enum';

export class UnauthorizedException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Unauthorized', ErrorCodeEnum.UNAUTHORIZED);
    }
}