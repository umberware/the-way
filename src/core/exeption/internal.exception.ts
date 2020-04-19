import { ApplicationException } from "./application.exception";

export class InternalException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Erro interno', 500);
    }
}
