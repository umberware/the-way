import { Application, HttpService, Inject, PropertiesConfiguration } from '@nihasoft/the-way';
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
    @Inject() propertiesConfiguration: PropertiesConfiguration;

    @Inject() restClient: RestClientService; // Only to test if the library is working.

    constructor() {
        console.log(this.propertiesConfiguration.properties);

        this.restClient.signIn(8080).subscribe(
        (credentials: any) => {
            this.restClient.getUserTenants(8080, credentials.token).subscribe(
            (users: Array<any>) => {
                console.log(users);
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    }
}