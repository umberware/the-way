import { Observable, of } from 'rxjs';

import { Rest, Get, PathParam } from '../../../../main';

@Rest('heroes')
export class HeroRest {
    public heroes: any = {
        1: {
            name: 'batman',
            power: 10000
        }
    }
    @Get('')
    public getAllHeroes(): Observable<any> {
        console.log(this.heroes)
        return of(Object.values(this.heroes));
    }
    @Get('hero/:id')
    public getHero(@PathParam('id') heroId: string): any {
        return this.heroes[heroId];
    }
}
