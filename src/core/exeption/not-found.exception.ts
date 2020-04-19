import { ApplicationException } from './application.exception';

export class NotFoundException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Not Found', 404);
    }
}