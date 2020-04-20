import { ApplicationException } from './application.exception';

export class NotAllowedException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Not Authorized', 403);
    }
}