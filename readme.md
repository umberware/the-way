[![Site](https://img.shields.io/badge/Site-blue.svg)](http://the-way.umberware.com/)
[![Documentation](https://img.shields.io/badge/Documentation-green.svg)](documentation/index.md)
[![Changelog](https://img.shields.io/badge/Changelog-lightseagreen.svg)](documentation/the-way/changelog.md)
[![Examples](https://img.shields.io/badge/Examples-lightblue.svg)](https://github.com/umberware/the-way-examples)
[![npm version](https://badge.fury.io/js/%40umberware%2Fthe-way.svg)](https://badge.fury.io/js/%40umberware%2Fthe-way)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](https://raw.githubusercontent.com/umberware/the-way/master/LICENSE)
[![EsLint](https://img.shields.io/badge/EsLint-Enabled-green.svg)](https://raw.githubusercontent.com/umberware/the-way/master/.eslintrc)
[![Build Status](https://travis-ci.com/umberware/the-way.svg?branch=master)](https://travis-ci.com/umberware/the-way)
[![codecov](https://codecov.io/gh/umberware/the-way/branch/master/graph/badge.svg?token=JDRUQC0T9A)](https://codecov.io/gh/umberware/the-way)
[![Donate](https://img.shields.io/badge/Donate-blue.svg)](http://the-way.umberware.com/donate)

# The Way

To improve the life cycle of the development in Node.js in a REST and/or POG concept, this framework is the way.
With this framework you can build a REST application more easily, you can make singletons and inject these singletons in another class, you can configure and manipulate yours class
more easily, in other words, the sky is not the limit!

## Summary

 - [Features](#features)
 - [Installing](#installing)
 - [Getting Started](#getting-started)
 - [Application Properties](#application-properties)
 - [Documentation](#documentation)

## Features

With this framework you can elevate the life cycle of the development in Node.js with a lot of features, and the principles are:

 - All in a Core: The framework will find the files that contains decorators of this framework and automatically import and process these decorators and configure when that class need to be configured
 - Class Injection & Singleton: When a class is decorated with some this framework decorators, we will instantiate and configure this class and allow this instance to be injected in another component
 - Overridden: If for some reason you want to change the behavior of a class, you can substitute that class and inject your custom class into the old class injection points
 - REST mapping and concepts more intelligible and concise: For that we use decorators to abstract some things and configure automatically the [express](https://github.com/expressjs/express) routes, security and others
 - HTTP and HTTPS automatic server: We use the [express](https://github.com/expressjs/express) to build a http and / or https server and you can customize some properties for this server
 - Features On The Way: We use YAML format to provide a lot of properties that can enable some feature or change their behavior

## Installing

This framework is built for NodeJs with Typescript, and you need a project configured.

**You can check how to create a NodeJs + Typescript project [here](documentation/guides/node-typescript-guide.md)**

Installing the TheWay:

*For Yarn*

    yarn add @umberware/the-way

*For Npm*

    npm install @umberware/the-way

**Remember to install @types/node as dev dependencies when you are using the typescript with Node**

## Getting Started

In this section we will create a simple application that use this framework.
We will presume that you was installed the node.js, configured to use typescript and installed the packages: `@umberware/the-way` and `@types/node`.

**You can check how to configure Node.js to work with Typescript in this guide: [NodeJs With Typescript](./documentation/guides/node-typescript-guide.md)**

*Main: A file in: src/main/main.ts*

    import { Application, TheWayApplication, Inject, CoreLogger } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject logger: CoreLogger;

        public start(): void {
            this.logger.info('Hello World');
        }
    }

*Running*

    ts-node src/main/main.ts


**You can check how to build a REST application in this guide: [TheWay: HeroesRest](./documentation/guides/the-way-heroes-rest.md)**

**For more examples or guides, you can access the [The Way Examples Repository](https://github.com/umberware/the-way-examples#readme) or/and [Guides](documentation/index.md#guides)**

## Application Properties

This framework use application properties in [Yaml Format](https://yaml.org/) and has a lot of properties that can be changed for your use. If no application properties is provided, the framework will use the **default** properties.
For more detail, please visit the [Application Properties Documentation](documentation/the-way/core/application-properties.md)

## Documentation

To access the full documentation you can access [this](documentation/index.md)