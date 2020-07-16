import { Put, Patch, Claims, Delete, QueryParam, Post, BodyParam, Head, Get, PathParam, NotFoundException} from '../../../main';

import { Observable, of, throwError } from 'rxjs';

import { HeroModel } from './model/hero.model';
import { delay } from 'rxjs/operators';

export class HeroRestTest {
    public heroes: {[key: string]: HeroModel | number} = {
        '1': {
            name: 'Anakin Skywalker',
            power: 10001,
            id: 1
        },
        lastId: 1
    };
    @Get('/hero/:id')
    public getHero(@PathParam('id') id: number): Observable<HeroModel> {
        const hero = this.heroes[id.toString()];
        if (!hero) {
            throw new NotFoundException('Hero not found');
        } else {
            return of(hero as HeroModel);
        }
    }

    @Head('/hero/:id')
    public heroExists(@PathParam('id') id: number): Observable<void> {
        if (!this.heroes[id.toString()]) {
            throw new NotFoundException('Hero not found');
        }
        return of();
    }
    @Post('/hero')
    public createHero(@BodyParam hero: HeroModel): Observable<HeroModel> {
        console.log(hero);
        (this.heroes.lastId as number)++;
        hero.id = this.heroes.lastId as number;
        this.heroes[hero.id.toString()] = hero;
        return of(hero);
    }
    @Get('/heroes')
    public getHeroes(@QueryParam params: {id: Array<number>}): Observable<Array<HeroModel>> {
        const foundHeroes: Array<HeroModel> = [];
        if (!params.id) {
            for(const heroId in this.heroes) {
                if (heroId !== 'lastId') {
                    foundHeroes.push(this.heroes[heroId] as HeroModel)
                }
            }
            return of(foundHeroes);
        } else {
            for (const id of params.id) {
                const hero = this.heroes[id.toString()]
                if (hero) {
                    foundHeroes.push(hero as HeroModel);
                }
            }
        }
        return of(foundHeroes)
    }
    @Put('/hero/:id')
    public updateHero(@PathParam('id') id: number, @BodyParam toUpdate: HeroModel): Observable<HeroModel> {
        const hero: HeroModel = this.heroes[id.toString()] as HeroModel;
        if (!hero) {
            throw new NotFoundException('Hero not found');
        }
        
        hero.name = toUpdate.name;
        hero.power = toUpdate.power;

        return of(hero);
    }
    @Patch('/hero/:id')
    public updateHeroInformation(@PathParam('id') id: number, @BodyParam toUpdate: any): Observable<HeroModel> {
        const hero: HeroModel = this.heroes[id.toString()] as any;
        if (!hero) {
            throw new NotFoundException('Hero not found');
        }
        
        if (toUpdate.name) {
            hero.name = toUpdate.name;
        }
        if (toUpdate.power) {
            hero.power = toUpdate.power;
        }

        return of(hero);
    }
    @Delete('/hero/:id')
    public deleteUser(@PathParam('id') id: number): Observable<HeroModel> {
        if (!this.heroes[id.toString()]) {
            return throwError(new Error('Hero not found'));
        }

        const hero: HeroModel = {...this.heroes[id.toString()] as HeroModel};
        delete this.heroes[id.toString()];

        return of(hero);
    }
    @Delete('/hero/wrongParam/:id')
    public wrongParam(@PathParam('uid') id: number): Observable<HeroModel> {
        const hero: HeroModel = {...this.heroes[id.toString()] as HeroModel};
        if (!hero) {
            throw new NotFoundException('Hero not found');
        }
        delete this.heroes[id.toString()];

        return of(hero);
    }
    @Delete('/hero/wrongAuthentication')
    public wrongAuthentication(@Claims claims: unknown): Observable<unknown> {
        return of(claims);
    }
}