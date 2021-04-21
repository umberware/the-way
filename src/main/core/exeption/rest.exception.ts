import { ApplicationException } from './application.exception';

export class RestException extends ApplicationException {
    constructor(public detail: string, public code: number, public description: string) {
        super(detail, description);
    }
}
