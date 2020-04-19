import { Inject } from '../../decorator';
import { SecurityService } from '../security.service';
import { ServerConfiguration } from '../../configuration/server.configuration';

export class HttpService {
    @Inject() securityService: SecurityService;
    @Inject() serverConfiguration: ServerConfiguration;

    constructor() {
        // console.log(this.securityService);
    }
}