import { Application, HttpService, Inject } from '@nihasoft/the-way';
import { CustomServerConfiguration } from './configuration/custom-server.configuration';
import { RestModule } from './rest-server/rest.module';
import { RestClientService } from './rest-client/rest-client.service';
import { CustomSecurityService } from './service/custom-security.service';

@Application(
    CustomSecurityService,
    CustomServerConfiguration,
    HttpService
)
export class Main {
    @Inject() restModule: RestModule;
    @Inject() restClient: RestClientService; // Only to test if the library is working.

    constructor() {
        this.restClient.signIn(8080);
        this.restClient.getUserTenants(8080);
    }
}