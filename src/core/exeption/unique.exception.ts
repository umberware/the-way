import { ApplicationException } from "./application.exception";

export class UniqueException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Erro interno', 500);
    }
}