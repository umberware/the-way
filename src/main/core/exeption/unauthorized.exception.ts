import { ApplicationException } from './application.exception';
import { Messages } from '../shared/messages';

export class UnauthorizedException extends ApplicationException {
    constructor(message: string) {
        super(message, Messages.getMessage('not-authorized') as string, Messages.getMessage('not-authorized-code'));
    }
}
