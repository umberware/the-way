import { RestException } from './rest.exception';
import { Messages } from '../shared/messages';

export class UnauthorizedException extends RestException {
    constructor(
        public detail: string, public code = 401,
        public description = Messages.getMessage('http-not-authorized')
    ) {
        super(code, detail, description);
    }
}
