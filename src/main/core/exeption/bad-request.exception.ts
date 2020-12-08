import { ApplicationException } from './application.exception';
import { Messages } from '../shared/messages';

export class BadRequestException extends ApplicationException {
    constructor(message: string) {
        super(message, Messages.getMessage('bad-request') as string,  Messages.getMessage('bad-request-code'));
    }
}
