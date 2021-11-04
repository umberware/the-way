[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](https://github.com/umberware/the-way-examples/tree/master/examples/heroes-rest/)

## The Way: HeroesRest

To use this guide you must have a project configured to use typescript and the libraries `@umberware/the-way` and `@types/node` installed.
You can check this [guide](node-typescript-guide.md) to configure.

This guide will teach you how to create a REST operation using the TheWay framework. So Autobots, roll out!

### Summary

 - [Fist Step: A main class](#first-step-a-main-file)
 - [HeroModel: A transactional object](#heromodel-a-transactional-object)
 - [HeroService: The service](#heroservice-the-service)
 - [HeroRest: The Hero operations](#herorest-the-hero-operations)
 - [Running](#running)
 - [Conclusion](#conclusion)

### First Step: A main file

The first step, is to create a main file for the bootstrap of your application

**Main:** *The main class(src/main/main.ts)*

    import { Application, TheWayApplication, Inject, CoreLogger } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject logger: CoreLogger;

        public start(): void {
            this.logger.info('Heroes On the WAY!');
        }
    }

### HeroModel: A transactional object

We need to create an interface that map the Hero information to transact this information between the points.

**HeroModel:** *The Hero transactional object(src/main/hero/model/hero.model.ts)*

    export interface HeroModel {
        id: number;
        name: string;
        power: number;
    }

### HeroService: The service

One good principle it's use a service to execute a concise objective/feature, so, we create a REST class to abstract the HTTP Request and the Response
and the service role is to execute the operations for the HERO feature and return the execution result.
It's important to know that example has a dummy mock implementation to store the heroes

**HeroService:** *The Hero feature executor(src/main/hero/hero.service.ts)*

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

### HeroRest: The Hero operations

Now, we need to create a REST class that will map the operations for the Hero features.

**HeroRest:** *The Hero feature REST operations(src/main/hero/hero.rest.ts)*

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

To create a REST operation with this framework, you need to create a class decorated with [@Rest](documentation/the-way/core/decorator/application-components-decorators.md#rest)
and in this decorator, you can pass a path. After this, you can use rest decorators in methods such as [@Get](documentation/the-way/core/decorator/rest-decorators.md#get)
to map a path and set security for this endpoint. Also, in a method decorated with a rest decorator, it is allowed to use property decorators to bind some REQUEST property, for example: [@PathParam](documentation/the-way/core/decorator/rest-decorators.md#pathparam)
In the code below, we created a HeroRest class decorated with `@Rest` and mapped a 'father path' as '/hero'. Also, we created a method `getHeroById` decorated with @Get and with the path ':id'.
With this code, we can bind a variable in the path with `@PathParam` and in the example below, the variable is **id**.

### Running

To execute the implemented code, you can build and execute the final source code, or you can use the [ts-node](https://www.npmjs.com/package/ts-node)

**Build and Run**

*Build*

    tsc

*Run*

    node OUTPUT_DIRECTORY/src/main/main.js

**Via ts-node**

    ts-node src/main/main.ts

### Conclusion

With TheWay framework, you can map a rest operation and define the security very easily like we did above. Also, when the [scan is enabled](documentation/the-way/core/application-properties.md#the-waycorescan) you don't need
to import your components decorated with some [Application Components Decorators](documentation/the-way/core/decorator/application-components-decorators.md), because it will be automatically registered when you call
your main class.

You can check the source code of this example [here](https://github.com/umberware/the-way-examples/tree/master/examples/heroes-rest/).

**For more examples or guides, you can access the [The Way Examples Repository](https://github.com/umberware/the-way-examples#readme) or/and [Guides](documentation/index.md#guides)**