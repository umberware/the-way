import { SecurityService, Service } from '@nihasoft/the-way'

@Service(SecurityService)
export class CustomSecurityService extends SecurityService {
    constructor() {
        super();
        this.TOKEN_KEY = 'Darth123456789987654321147852361';
        this.USER_PRIVATE_KEY = 'Darth1234567899876543211asasddq2';
    }
}