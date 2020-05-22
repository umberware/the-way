import { Inject, PropertiesConfiguration, TheWayApplication, Application } from '@nihasoft/the-way';

import { map, switchMap } from 'rxjs/operators'

import { CustomServerConfiguration } from './configuration/custom-server.configuration';
import { RestModule } from './rest-server/rest.module';
import { RestClientService } from './rest-client/rest-client.service';


@Application({
    custom: [
        CustomServerConfiguration
    ]
})
export class Main extends TheWayApplication {
    @Inject() restModule: RestModule;
    @Inject() propertiesConfiguration: PropertiesConfiguration;
    @Inject() restClient: RestClientService; // Only to test if the library is working.

    public start(): void {
        this.restClient.signIn(8080).pipe(
            switchMap((credentials: any) => {
                const token = credentials.token;
                return this.restClient.getUserById(8080, token, 10);
            })
        ).subscribe();
    }
}