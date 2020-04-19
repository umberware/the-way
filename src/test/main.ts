import { Application, Inject } from '../core/decorator';
import { ClassInjectable2 } from './class-injectable-2';
import { ClassConfiguration } from './class-configuration';
import { HttpService } from '../core/service/http/http.service';

@Application()
export class Main {
    // @Inject() httpService: HttpService;
    @Inject() classConfiguration: ClassConfiguration;
    @Inject() juca: ClassInjectable2;

    constructor() {
    }
}