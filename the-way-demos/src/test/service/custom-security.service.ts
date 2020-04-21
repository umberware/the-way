import { SecurityService, Service } from '@nihasoft/the-way'

@Service(SecurityService)
export class CustomSecurityService extends SecurityService {
    constructor() {
        super();
        this.TOKEN_KEY = 'MY-CUSTOM-KEY-IS-SO-BEAUTIFULL-BUT-DARTH-VADER-IS-THE-KING-WTH';
        this.USER_PRIVATE_KEY = 'MY-CUSTOM-KEY-IS-SO-BEAUTIFULL-BUT-DARTH-VADER-IS-THE-KING-WTH';
    }
}