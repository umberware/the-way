import { ApplicationException } from './application.exception';
import { Messages } from '../shared/messages';

export class InternalException extends ApplicationException {
    constructor(message: string) {
        super(message, Messages.getMessage('internal-server-error') as string, Messages.getMessage('internal-server-error-code') as string);
    }
}
