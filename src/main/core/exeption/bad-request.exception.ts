import { ApplicationException } from './application.exception';
import { Messages } from '../shared/messages';

export class BadRequestException extends ApplicationException {
    constructor(message: string) {
        super(message, Messages.getMessage('bad-request'),  Messages.getCodeMessage('bad-request-code'));
    }
}
