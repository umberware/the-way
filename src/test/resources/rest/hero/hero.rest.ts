import { Request, Response } from 'express';
import { Observable, of } from 'rxjs';

import {
    Rest,
    Get,
    PathParam,
    QueryParam,
    ResponseContext,
    RequestContext,
    HeaderContext,
    Post, BodyParam, Delete, Head, Put
} from '../../../../main';

@Rest('heroes')
export class HeroRest {
    public heroes: any = [
        {
            id: 0,
            name: 'batman',
            power: 10000
        }, {
            id: 1,
            name: 'superman',
            power: 9000
        }, {
            id: 2,
            name: 'flash',
            power: 5000
        }
    ]
    @Get('')
    public getAllHeroes(): Observable<any> {
        return of(this.heroes);
    }
    @Post('')
    public createHero(@BodyParam hero: any): any {
        const lastId = this.heroes.length;
        hero.id = lastId;
        this.heroes.push(hero);
        return this.heroes[lastId];
    }
    @Get('hero/:id')
    public getHero(@PathParam('id') heroId: string): any {
        return this.heroes.find((hero: any) => hero.id == heroId);
    }
    @Get('power')
    public getHeroByPower(
        @QueryParam param: any, @ResponseContext response: Response,
        @RequestContext request: Request, @HeaderContext headers: any
    ): Array<any> {
        const heroes = this.heroes.filter((hero: any) => hero.power > param.power);
        if (!request || !response || !param || !headers) {
            throw new Error('Some Injections is Empty.');
        }
        response.send(heroes);
        return heroes;
    }
    @Delete('hero/:id')
    public deleteHero(@PathParam('id') heroId: string): any {
        let removed;
        for (let i = 0; i < this.heroes.length; i++) {
            const hero = this.heroes[i];
            if (hero.id == heroId && !removed) {
                removed = hero;
                this.heroes.splice(i, 1);
                i--;
            } else if (removed) {
                hero.id = i;
            }
        }
        return removed;
    }
    @Head('')
    public isOnline(): any {}

    @Put('/byName')
    public updateByName(@BodyParam updateHero: any): any {
        const index = this.heroes.findIndex((hero: any) => hero.name === updateHero.name)
        updateHero.id = this.heroes[index];
        this.heroes[index] = updateHero;
        return this.heroes[index];
    }
}
