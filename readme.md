[![Documentation](https://img.shields.io/badge/Documentation-lightseagreen.svg)](https://nihasoft.github.io/the-way/)
[![Exampples](https://img.shields.io/badge/Examples-lightseagreen.svg)](https://github.com/nihasoft/the-way-examples)
[![Version](https://img.shields.io/badge/Version-0.5.8-lightseagreen.svg)](https://www.npmjs.com/package/@nihasoft/the-way)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](https://raw.githubusercontent.com/nihasoft/the-way/master/LICENSE)
[![EsLint](https://img.shields.io/badge/EsLint-Enabled-green.svg)](https://raw.githubusercontent.com/nihasoft/the-way/master/.eslintrc)
[![Build Status](https://travis-ci.com/nihasoft/the-way.svg?branch=master)](https://travis-ci.com/nihasoft/the-way)
[![codecov](https://codecov.io/gh/nihasoft/the-way/branch/master/graph/badge.svg)](https://codecov.io/gh/nihasoft/the-way)
[![Donate](https://img.shields.io/badge/%24-Donate-blue.svg)](https://nihasoft.github.io/the-way/donate)

# The Way
To improve the life cicle of the development, we created this framework to help your application to be more clean and intelligible with a loot of decorators.
With this you can use an express server with improvements (best practices from express) with **swagger** (when provided the swagger.json), inject classes (as singleton), overridde classes, automatic configurations provided by [@Configuration](https://nihasoft.github.io/the-way/#/guide/application-decorator#configure), [destroy](https://nihasoft.github.io/the-way/#/guide/core#destroy), you can map and use **REST** method's more intuitive and more clean with the [Rest & Decorators](https://nihasoft.github.io/the-way/#/guide/rest). You can [define some properties](https://nihasoft.github.io/the-way/#/guide/application-properties)  overriding the default properties and putting in this file **yours** custom properties to use in your classes injecting the  class [PropertiesConfiguration](https://nihasoft.github.io/the-way/#/guide/configurations#properties-configuration).

You also can customize some behaviors of this framework with decorators [@Configuration](https://nihasoft.github.io/the-way/#/guide/application-decorator#configure) and [@Service](https://nihasoft.github.io/the-way/#/guide/application-decorator#service).

**Note**: When you use the @Configure you **MUST** extends the class [AbstractConfiguration](https://nihasoft.github.io/the-way/#/guide/configurations#abstract-configuration).

**Note**: By default, we start an express http server. To change this behavior you must provide an **application.properties.yml in the root path of your project** or with the command line argument: **--properties=/path/to/your/properties/application.properties.yml**


    the-way:
        server:
            enabled: false

# Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [All The Current Application Properties](#applicationproperties)
- [Issues](#issues)
- [Full Documentation](#documentation)

# Installation
To use this framework you must have a project with Node.js and configurated to use Typescript, you can see how to do this [here](https://nihasoft.github.io/the-way/#/guide/fast-setup#tsNode).

With a project in Node.Js configurated with Typescript you only need to install this framework with commando below:

    npm i @nihasoft/the-way

**Note:** This library use the @types/node and the rxjs. So, your application must have this libraries as devDependency and as dependency respectively.

# Usage
With the framework installed you can now do the magic.
You only need to create a "main class" that extends the [TheWayApplication](https://nihasoft.github.io/the-way/#/guide/core#the-way-application) and decorate your class with the [@Application()](https://nihasoft.github.io/the-way/#/guide/application-decorator#application)

The example below can be viewed [here](https://nihasoft.github.io/the-way/#/guide/fast-setup#theWay)

### The Main Class

    import { TheWayApplication, Application } from '@nihasoft/the-way'

    @Application()
    export class Main extends TheWayApplication {
        public start(): void {
            console.log('Yeah, now I\'m The Way application');
        }
    }

### The Command to run

In your project:

    tsc && path_to_your_dist/main.js

This example above, will enable the application to use [Rest & Decorators](https://nihasoft.github.io/the-way/#/guide/rest) and the [Application Decorators](https://nihasoft.github.io/the-way/#/guide/application-decorator). Will be used the **default configurations** like properties, security, configurations and services. You can check all the default properties and beheviors [here](https://nihasoft.github.io/the-way/).

## Inject decorator
Some times we want to use a singleton and import/inject this class into another class. You can to this using the decorator [@Inject()](https://nihasoft.github.io/the-way/#/guide/application-decorator#inject). The example below can be viewed [here](https://nihasoft.github.io/the-way/#/guide/fast-setup#injection-example)

### Creating a class to be injected
    export class InjectionExample {
        public helloWorld() {
            console.log('hello world');
        }
    }

### Injecting another class into you main

    import { TheWayApplication, Application, Inject } from '@nihasoft/the-way'
    import { InjectionExample } from './injection-example';

    @Application()
    export class Main extends TheWayApplication {

        @Inject() injectionExample: InjectionExample;

        public start(): void {
            this.injectionExample.helloWorld();
        }
    }


## Rest & Decorator
In this section we will create a rest class with some methods enabled to be called. The example below, can be viewed [here](https://nihasoft.github.io/the-way/#/guide/fast-setup#rest-example)

**Note**: We will concat your path in decorators with the property **the-way.server.path**. To change this behavior you must provide an **application.properties.yml in the root path of your project** or with the command line argument: **--properties=/path/to/your/properties/application.properties.yml**

    the-way:
        server:
            path: /api

**Note**: By default, we start an express http server. To change this behavior you must provide an **application.properties.yml in the root path of your project** or with the command line argument: **--properties=/path/to/your/properties/application.properties.yml**

    the-way:
        server:
            enabled: false

### Creating a rest class with some rest methods

    import { Get } from '@nihasoft/the-way';
    import { Observable, of } from 'rxjs';

    export class HeroRest {
        @Get('/hero')
        public getHero(): Observable<{id: number, name: string, power: number}> {
            return of({
                id: 10,
                name: 'Batman',
                power: 10000
            })
        }
    }

### Importing that class into main

    import { TheWayApplication, Application, Inject } from '@nihasoft/the-way'
    import { InjectionExample } from './injection-example';
    import { HeroRest } from './hero.rest';

    @Application()
    export class Main extends TheWayApplication {

        @Inject() injectionExample: InjectionExample;
        @Inject() heroRest: HeroRest;

        public start(): void {
            this.injectionExample.helloWorld();
        }
    }

# ApplicationProperties

We use an application.propertles.yml to be configurable by parameters, you can provide in the root path of your project **application.properties.yml** or with command line argument: **--properties=/path/to/your/properties/application.properties.yml**. You can see more [here](https://nihasoft.github.io/the-way/#/guide/application-properties).
The current default properties are:

    the-way:
        core:
            log: true
        log:
            level: 0
        server:
            enabled: true
            port: 8081
            path: /api
            swagger:
                enabled: false
                path: /swagger
                filePath: './swagger.json'
            security:
                user-key: A2345678901234567890123456789012
                token-key: B2345678901234567890123456789034
                token-expiration: '3 days'
            file:
                enabled: false
                fallback: false
                full: false
                path: ''
                static: 
                    path: ''
                    full: false
                assets: 
                    path: ''
                    full: false

# Issues

If you have an idea, a bug, a feature or anything else, please help us to growth creating an issue for that [here](https://github.com/nihasoft/the-way/issues)

# Documentation 

You can access the full documentation [here](https://nihasoft.github.io/the-way/)
