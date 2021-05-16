import { Observable, of } from 'rxjs';

import { Rest, Get, Claims, TokenClaims } from '../../../../main';

@Rest('wrong')
export class HeroRest {
    @Get('')
    public getAllHeroes(@Claims claims: TokenClaims): Observable<any> {
        return of([]);
    }
}
