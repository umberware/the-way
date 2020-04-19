import { CustomSecurityService } from './service/custom-security.service';
import { HttpService } from '../core/service/http/http.service';
import { Application, Inject } from '../core/decorator';
import { RestModule } from './rest/rest.module';
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
    }
}