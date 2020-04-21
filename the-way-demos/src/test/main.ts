import { HttpService, Application, Inject } from '@nihasoft/the-way';

import { CustomSecurityService } from './service/custom-security.service';
import { RestModule } from './rest-server/rest.module';
import { RestClientService } from './rest-client/rest-client.service';

@Application(
    CustomSecurityService,
    HttpService
)
export class Main {
    @Inject() restModule: RestModule;
    @Inject() restClient: RestClientService;

    constructor() {
        this.restClient.signIn();
        this.restClient.getUserTenants();
    }
}