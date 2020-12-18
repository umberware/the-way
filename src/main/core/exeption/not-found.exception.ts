import { ApplicationException } from './application.exception';
import { Messages } from '../shared/messages';

export class NotFoundException extends ApplicationException {
    constructor(message: string) {
        super(message, Messages.getMessage('not-found'), Messages.getCodeMessage('not-found-code'));
    }
}
