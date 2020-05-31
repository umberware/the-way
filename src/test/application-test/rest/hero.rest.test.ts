import { Put, Patch, Del, QueryParam, Post, BodyParam, Head, Get, PathParam, NotFoundException} from '../../../main';

import { Observable, of } from 'rxjs';

import { HeroModel } from './model/hero.model';

export class HeroRestTest {
    public heroes: {[key: string]: HeroModel | number} = {
        '1': {
            name: 'Anakin Skywalker',
            power: 10001,
            id: 1
        },
        lastId: 1
    };

    /**
    *   @swagger 
    *   /hero/{id}:
    *       get:
    *           description: Use to get a hero
    *           produces:
    *               - application/json
    *           parameters:
    *               -   in: path
    *                   name: id
    *                   description: Id do hero.
    *                   required: true
    *                   type: number
    *           responses:
    *               200:
    *                   description: The hero
    *                   content:
    *                       application/json:
    *                           schema:
    *                               type: object
    *                               properties:
    *                                   id: # the unique user id
    *                                      type: number
    *                                   power: # The hero power
    *                                      type: number
    *                                   name: # The hero name
    *                                       type: string
    *               404: 
    *                   description: Hero not found
    */
    @Get('/hero/:id')
    public getHero(@PathParam('id') id: number): Observable<HeroModel> {
        const hero = this.heroes[id.toString()];
        if (!hero) {
            throw new NotFoundException('Hero not found');
        } else {
            return of(hero as HeroModel);
        }
    }

    /**
    *   @swagger 
    *   /hero/{id}:
    *       head:
    *           description: check if hero exists
    *           consumes:
    *               - application/json
    *           responses:
    *               '200':
    *                   description: Hero exists
    *               '404': 
    *                   description: Hero not found
    */
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
    @Del('/hero/:id')
    public deleteUser(@PathParam('id') id: number): Observable<HeroModel> {
        const hero: HeroModel = {...this.heroes[id.toString()] as HeroModel};
        if (!hero) {
            throw new NotFoundException('Hero not found');
        }
        delete this.heroes[id.toString()];

        return of(hero);
    }
}