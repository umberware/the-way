import { Observable, of } from 'rxjs';

import { Rest, Get } from '../../../main/index';

@Rest('heroe')
export class HeroRest {
    @Get('heroes')
    public getAllHeroes(): Observable<any> {
        console.log('ok');
        return of([]);
    }
}