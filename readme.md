[![Documentation](https://img.shields.io/badge/Documentation-lightseagreen.svg)](http://the-way.umberware.com)
[![Exampples](https://img.shields.io/badge/Examples-lightseagreen.svg)](https://github.com/umberware/the-way-examples)
[![npm version](https://badge.fury.io/js/%40umberware%2Fthe-way.svg)](https://badge.fury.io/js/%40umberware%2Fthe-way)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](https://raw.githubusercontent.com/umberware/the-way/master/LICENSE)
[![EsLint](https://img.shields.io/badge/EsLint-Enabled-green.svg)](https://raw.githubusercontent.com/umberware/the-way/master/.eslintrc)
[![Build Status](https://travis-ci.org/umberware/the-way.svg?branch=master)](https://travis-ci.org/umberware/the-way)
[![codecov](https://codecov.io/gh/umberware/the-way/branch/master/graph/badge.svg)](https://codecov.io/gh/umberware/the-way)
[![Donate](https://img.shields.io/badge/%24-Donate-blue.svg)](http://the-way.umberware.com/donate)

# The Way
To improve the life cicle of the development, we created this framework to help your application to be more clean and intelligible with a loot of decorators.
With this you can use an express server with improvements (best practices from express) with **swagger** (when provided the swagger.json), inject classes (as singleton), overridde classes, automatic configurations provided by [@Configuration](http://the-way.umberware.com#/guide/application-decorator#configure), [destroy](http://the-way.umberware.com#/guide/core#destroy), you can map and use **REST** method's more intuitive and more clean with the [Rest & Decorators](http://the-way.umberware.com#/guide/rest). You can [define some properties](http://the-way.umberware.com#/guide/application-properties)  overriding the default properties and putting in this file **yours** custom properties to use in your classes injecting the  class [PropertiesConfiguration](http://the-way.umberware.com#/guide/configurations#properties-configuration).

You also can customize some behaviors of this framework with decorators [@Configuration](http://the-way.umberware.com#/guide/application-decorator#configure) and [@Service](http://the-way.umberware.com#/guide/application-decorator#service).

**Note**: When you use the @Configure you **MUST** extends the class [AbstractConfiguration](http://the-way.umberware.com#/guide/configurations#abstract-configuration).

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
To use this framework you must have a project with Node.js and configurated to use Typescript, you can see how to do this [here](http://the-way.umberware.com#/guide/fast-setup#tsNode).

With a project in Node.Js configurated with Typescript you only need to install this framework with commando below:

    npm i @umberware/the-way

**Note:** This library use the @types/node and the rxjs. So, your application must have this libraries as devDependency and as dependency respectively.

# Usage
With the framework installed you can now do the magic.
You only need to create a "main class" that extends the [TheWayApplication](http://the-way.umberware.com#/guide/core#the-way-application) and decorate your class with the [@Application()](http://the-way.umberware.com#/guide/application-decorator#application)

The example below can be viewed [here](http://the-way.umberware.com#/guide/fast-setup#theWay)

### The Main Class

    import { TheWayApplication, Application } from '@umberware/the-way'

    @Application()
    export class Main extends TheWayApplication {
        public start(): void {
            console.log('Yeah, now I\'m The Way application');
        }
    }

### The Command to run

In your project:

    tsc && path_to_your_dist/main.js

This example above, will enable the application to use [Rest & Decorators](http://the-way.umberware.com#/guide/rest) and the [Application Decorators](http://the-way.umberware.com#/guide/application-decorator). Will be used the **default configurations** like properties, security, configurations and services. You can check all the default properties and beheviors [here](http://the-way.umberware.com).

## Inject decorator
Some times we want to use a singleton and import/inject this class into another class. You can to this using the decorator [@Inject()](http://the-way.umberware.com#/guide/application-decorator#inject). The example below can be viewed [here](http://the-way.umberware.com#/guide/fast-setup#injection-example)

### Creating a class to be injected
    export class InjectionExample {
        public helloWorld() {
            console.log('hello world');
        }
    }

### Injecting another class into you main

    import { TheWayApplication, Application, Inject } from '@umberware/the-way'
    import { InjectionExample } from './injection-example';

    @Application()
    export class Main extends TheWayApplication {

        @Inject() injectionExample: InjectionExample;

        public start(): void {
            this.injectionExample.helloWorld();
        }
    }


## Rest & Decorator
In this section we will create a rest class with some methods enabled to be called. The example below, can be viewed [here](http://the-way.umberware.com#/guide/fast-setup#rest-example)

**Note**: We will concat your path in decorators with the property **the-way.server.path**. To change this behavior you must provide an **application.properties.yml in the root path of your project** or with the command line argument: **--properties=/path/to/your/properties/application.properties.yml**

    the-way:
        server:
            path: /api

**Note**: By default, we start an express http server. To change this behavior you must provide an **application.properties.yml in the root path of your project** or with the command line argument: **--properties=/path/to/your/properties/application.properties.yml**

    the-way:
        server:
            enabled: false

### Creating a rest class with some rest methods

    import { Get } from '@umberware/the-way';
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

    import { TheWayApplication, Application, Inject } from '@umberware/the-way'
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

We use an application.propertles.yml to be configurable by parameters. You can provide in the root path of your project **application.properties.yml** or with command line argument: **--properties=/path/to/your/properties/application.properties.yml**. You can see more [here](http://the-way.umberware.com#/guide/application-properties).
You can also pass **command line properties**. Properties passed in argument line will be the priority.

Example:

    --the-way.server.port=8090

if in my application properties the the-way.server.port is 8081 but if is passed the the-way.server.port in command line so the final value will be the value passed in command line (like the example above, the value will be 8090).

The current default properties are:

    the-way:
        core:
            log:
                enabled: true
                level: 0
        server:
            enabled: true
            operations-log: true
            http:
                port: 80
                enabled: true
            https:
                port: 443
                enabled: false
                keyPath: ''
                certPath: ''
            helmet:
                enabled: true
            cors:
                enabled: true
                origin: true
            rest:
                path: /api
                security:
                    user-key: A2345678901234567890123456789012
                    token-key: B2345678901234567890123456789034
                    token-expiration: '3 days'
                swagger:
                    enabled: false
                    path: /swagger
                    filePath: './swagger.json'
            file:
                enabled: false
                fallback: false
                full: false
                path: ''
                static:
                    path: ''
                    full: false
                    enabled: false
                assets:
                    path: ''
                    full: false
                    enabled: false