import { RestException } from './rest.exception';
import { Messages } from '../shared/messages';

export class BadRequestException extends RestException {
    constructor(
        public detail: string, public code = 400,
        public description = Messages.getMessage('http-bad-request')
    ) {
        super(detail, code, description);
    }
}
