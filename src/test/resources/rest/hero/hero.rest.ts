import { Request, Response } from 'express';
import { Observable, of } from 'rxjs';

import { Rest, Get, PathParam, QueryParam, ResponseContext, RequestContext, HeaderContext } from '../../../../main';
import assert = require('node:assert');

@Rest('heroes')
export class HeroRest {
    public heroes: any = {
        1: {
            name: 'batman',
            power: 10000
        }, 2: {
            name: 'superman',
            power: 9000
        }, 3: {
            name: 'flash',
            power: 5000
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
    @Get('power')
    public getHeroByPower(
        @QueryParam param: any, @ResponseContext response: Response,
        @RequestContext request: Request, @HeaderContext headers: any
    ): Array<any> {
        const heroes = Object.values(this.heroes).filter((hero: any) => hero.power > param.power);
        if (!request || !response || !param || !headers) {
            throw new Error('Some Injections is Empty.');
        }
        response.send(heroes);
        return heroes;
    }
}
