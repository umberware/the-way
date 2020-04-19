import { ApplicationException } from './application.exception';

export class BadRequestException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Informação inválida', 400);
    }
}