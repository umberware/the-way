import { Observable, of } from 'rxjs';

import {
    Rest,
    Get,
    Inject, CoreSecurityService
} from '../../../../main';

@Rest('hunters', true, [ 'hunter-master' ])
export class HunterRest {
    @Inject security: CoreSecurityService;

    hunters = [{
        name: 'gon'
    }]

    @Get('')
    public getAllHunters(): Observable<any> {
        return of(this.hunters);
    }

}
