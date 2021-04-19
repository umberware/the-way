import { RestException } from './rest.exception';

export class InternalException extends RestException {
    constructor(detail: string, protected code = 500, description = 'Erro interno') {
        super(detail, code, description);
    }
}
