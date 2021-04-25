import { ApplicationException } from './application.exception';

export class RestException extends ApplicationException {
    constructor(public code: number, public detail: string, public description: string) {
        super(detail, description);
    }
}
