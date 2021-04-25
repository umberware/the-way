import { RestException } from './rest.exception';
import { Messages } from '../shared/messages';

export class InternalException extends RestException {
    constructor(
        public detail: string, public code = 500,
        public description = Messages.getMessage('http-internal-server-error')
    ) {
        super(code, detail, description);
    }
}
