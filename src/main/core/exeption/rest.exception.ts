import { ApplicationException } from './application.exception';

export class RestException extends ApplicationException {
    constructor(detail: string, protected code: number, description = 'Erro interno') {
        super(detail, description);
    }

    public getCode(): number {
        return this.code;
    }
}