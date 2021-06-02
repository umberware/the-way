## The Way: HeroesRest

If you configured your node.js project to use typescript and installed the `@umberware/the-way` and `@types/node` you can move to the start right now!
This guide will teach to you to create a REST operation using the framework TheWay. So, Autobots, roll out!

Create your main file

*Main: A file in: src/main/main.ts*

    import { Application, TheWayApplication, Inject, CoreLogger } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject logger: CoreLogger;

        public start(): void {
            this.logger.info('Heroes On the WAY!');
        }
    }

Create a hero model

*HeroModel: A file in: src/main/hero/model/hero.model.ts*

    export interface HeroModel {
        id: number;
        name: string;
        power: number;
    }

Create a HeroService with an array of heroes mocked

*HeroService: A file in: src/main/hero/hero.service.ts*

    import { Service, NotFoundException } from '@umberware/the-way';

    import { Observable, of } from 'rxjs';

    import { HeroModel } from './model/hero.model';

    @Service()
    export class HeroService {
        private heroesMock: Array<HeroModel> = [{
            name: 'Batman',
            id: 1,
            power: 1349
        }]

        public getHeroById(id: number): Observable<HeroModel> {
            const heroFound = this.heroesMock.find((hero: HeroModel) => hero.id === id);
            if (!heroFound) {
                throw new NotFoundException('Hero not found');
            }
            return of(heroFound)
        }
    }

To create a REST operation with this framework, you need to create a class decorated with [@Rest](../the-way/core/decorator/core-decorators.md#rest)
and in this decorator, you can pass a path. After this, you can use the rest decorators in the methods like [@Get](../the-way/core/decorator/rest-decorators.md#get) to map and use others decorators do bind some REQUEST property, for example: [@PathParam](../the-way/core/decorator/rest-decorators.md#pathparam)
In the code below, we created a HeroRest class decorated with `@Rest` and mapped a 'father path' as '/hero'. Also, we created a method `getHeroById` decorated with @Get and with the path ':id'.
With this code, we can bind a variable in the path with `@PathParam`, in the example below, the variable is **id**.


*HeroRest: A file in: src/main/hero/hero.rest.ts*

    import { Get, Inject, PathParam, Rest } from '@umberware/the-way';

    import { Observable } from 'rxjs';

    import { HeroModel } from './model/hero.model';
    import { HeroService } from './hero.service';

    @Rest( '/hero')
    export class HeroRest {
    @Inject heroService: HeroService;

        @Get(':id')
        public getHeroById(@PathParam('id') id: string): Observable<HeroModel> {
            return this.heroService.getHeroById(parseInt(id, 10));
        }
    }


**Note:** You don't need to import the HeroRest into the Main if you use the properties ['the-way.core.scan'](documentation/the-way/core/application-properties.md#the-waycorescan)

*Running*

    ts-node src/main/main.ts

You can check the source code of this example [here](https://github.com/umberware/the-way-examples/tree/master/examples/heroes-rest/).

**For more examples or guides, you can access the [The Way Examples Repository](https://github.com/umberware/the-way-examples#readme) or/and [Guides](../index.md#guides)**