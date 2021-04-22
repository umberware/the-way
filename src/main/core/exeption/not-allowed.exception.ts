import { RestException } from './rest.exception';
import { Messages } from '../shared/messages';

export class NotAllowedException extends RestException {
    constructor(
        public detail: string, public code = 403,
        public description = Messages.getMessage('http-not-allowed')
    ) {
        super(detail, code, description);
    }
}
