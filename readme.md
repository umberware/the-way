[![Site](https://img.shields.io/badge/Site-blue.svg)](http://the-way.umberware.com/)
[![Documentation](https://img.shields.io/badge/Documentation-blue.svg)](documentation/index.md)
[![Changelog](https://img.shields.io/badge/Changelog-blue.svg)](documentation/the-way/changelog.md)
[![Examples](https://img.shields.io/badge/Examples-blue.svg)](https://github.com/umberware/the-way-examples)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://raw.githubusercontent.com/umberware/the-way/master/LICENSE)
[![EsLint](https://img.shields.io/badge/EsLint-Enabled-blue.svg)](https://raw.githubusercontent.com/umberware/the-way/master/.eslintrc)
[![Donate](https://img.shields.io/badge/Donate-blue.svg)](http://the-way.umberware.com/donate)
[![Build Status](https://travis-ci.com/umberware/the-way.svg?branch=master)](https://travis-ci.com/umberware/the-way)
[![codecov](https://codecov.io/gh/umberware/the-way/branch/master/graph/badge.svg?token=JDRUQC0T9A)](https://codecov.io/gh/umberware/the-way)

# The Way

We built a framework to help you, turning your development easier and your code simple!
With this framework, you can define REST operations easily and simply, inject an instance of a class, configure and destroy instances automatically, override classes to define your behavior, enable/disable features, and a lot more things.
With TheWay, the sky is not the limit!

## Summary

 - [Features](#features)
 - [Installing](#installing)
 - [Getting Started](#getting-started)
 - [Application Properties](#application-properties)
 - [Documentation](#documentation)

## Features

With this framework you can elevate the life cycle of the development in Node.js with a lot of features. The main features are:

 - All in a Core: The [Core](documentation/the-way/core/core.md) will prepare every thing for your application, the life cycle of instances, the instances dependencies, the configurations, the rest operations and a lot more
 - Class Injection & Singleton: With [@Inject](documentation/the-way/core/decorator/core-decorators.md#inject) decorator, will tell to Core to create an instance of the wanted class as a singleton. So, you don't need to instantiate the classes because the Core will resolve it for you
 - Overridden: Some cases we want to create a custom behavior to resolve a certain problem, and thinking about it, the [@Configuration](documentation/the-way/core/decorator/core-decorators.md#configuration) and [@Service](documentation/the-way/core/decorator/core-decorators.md#service) can be used to do this. When you pass as argument a class in these decorators, the injections points will change from the old class to override class
 - REST mapping and concepts more intelligible and concise: With the [Rest Decorators](documentation/the-way/core/decorator/rest-decorators.md), you can create more intelligibility and easily REST operations
 - HTTP and HTTPS automatic server: We use the [express](https://github.com/expressjs/express) to build a http and / or https server and you can customize some properties for this server
 - Features On The Way: We use YAML format to provide a lot of properties that can enable some feature or change their behavior

## Installing

This framework is built for NodeJs with Typescript, and you need a project configured to use.

**You can check how to create a NodeJs + Typescript project [here](documentation/guides/node-typescript-guide.md)**

Installing the TheWay:

*For Yarn*

    yarn add @umberware/the-way

*For Npm*

    npm install @umberware/the-way

**Remember to install @types/node as dev dependencies when you are using the typescript with Node**

## Getting Started

In this section we will create a simple application that uses this framework.
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

This framework uses application properties in [Yaml Format](https://yaml.org/) and has a lot of properties that can be changed for your use. If no application properties is provided, the framework will use the **default** properties.
For more detail, please visit the [Application Properties Documentation](documentation/the-way/core/application-properties.md)

## Documentation

To access the full documentation you can access [this](documentation/index.md)