<p align="center">
    <a href = "http://the-way.umberware.com/" target = "_blank">
        <img src = "https://github.com/umberware/the-way/blob/master/src/main/resources/the-way-small-full.png" width="380" alt="The Way Logo"/>
    </a>
</p>
<p align="center">A framework to enhance the development with NodeJs and Typescript, promoting agility, simplicity and intelligibility. With TheWay, the sky is not the limit!</p>

[![Site](https://img.shields.io/badge/Site-blue.svg?style=for-the-badge)](http://the-way.umberware.com/)
[![Documentation](https://img.shields.io/badge/Documentation-blue.svg?style=for-the-badge)](documentation/index.md)
[![Changelog](https://img.shields.io/badge/Changelog-blue.svg?style=for-the-badge)](documentation/the-way/changelog.md)
[![Examples](https://img.shields.io/badge/Examples-blue.svg?style=for-the-badge)](https://github.com/umberware/the-way-examples)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://raw.githubusercontent.com/umberware/the-way/master/LICENSE)
[![EsLint](https://img.shields.io/badge/EsLint-Enabled-blue.svg?style=for-the-badge)](https://raw.githubusercontent.com/umberware/the-way/master/.eslintrc)
[![Build Status](https://img.shields.io/travis/umberware/the-way/master.svg?label=Build&style=for-the-badge)](https://travis-ci.com/umberware/the-way)
[![Coverage](https://img.shields.io/codecov/c/gh/umberware/the-way/master?token=JDRUQC0T9A&style=for-the-badge)](https://codecov.io/gh/umberware/the-way)
[![Sponsor](https://img.shields.io/badge/Sponsor-black?logo=github-sponsors&style=for-the-badge)](https://opencollective.com/umberware#category-CONTRIBUTE)
[![Discord](https://img.shields.io/badge/Discord-black?logo=discord&style=for-the-badge)](https://discord.gg/jJTReZwpgU)

## Summary

 - [Features](#features)
 - [Installing](#installing)
 - [Getting Started](#getting-started)
 - [Application Properties](#application-properties)
 - [Documentation](#documentation)

## Features

Using TheWay, you can easily and simply define REST operations, inject instances of a class, automatically configure and destroy instances, override classes to define a custom behavior, enable/disable features, and much more.
The proposal of TheWay is to enhance the life cycle of the development in Node.js with a lot of features. The main features are:

 - Class Injection & Singleton: When the [@Inject](documentation/the-way/core/decorator/core-decorators.md#inject) decorator is used, a dependency will be registered, and the [Core](documentation/the-way/core/core.md) will instantiate this dependency (as singleton) and inject at the injection point
 - REST Operations & Concepts: With the [Rest Decorators](documentation/the-way/core/decorator/rest-decorators.md), you can create REST operations with intelligibility, security and conciseness
 - HTTP and HTTPS server: We use the [express](https://github.com/expressjs/express) to build a http and / or https server, and you can customize some properties for this server
 - Configurable & Destroyable: When you want to configure something before the "running state", you can extend the [Configurable](documentation/the-way/core/shared/abstract/configurable.md) class and implement the method *configure* or if you want to execute something before the destruction, you can extend the [Destroyable](documentation/the-way/core/shared/abstract/destroyable.md) class and implement the method *destroy*
 - Automatic Components Scan: By default, classes decorated with a [Core Decorator](documentation/the-way/core/decorator/core-decorators.md) and placed in the [scan path](documentation/the-way/core/application-properties.md#the-waycorescan), will be automatically registered in the [Core](documentation/the-way/core/core.md). You can disable this feature and manually inject into your main class, the components. For more information, please visit the [documentation](documentation/the-way/core/application-properties.md#the-waycorescan)
 - Overridden: In some cases, we want to create a custom class and replace the old behavior, thinking about it, the [@Configuration](documentation/the-way/core/decorator/core-decorators.md#configuration) and [@Service](documentation/the-way/core/decorator/core-decorators.md#service) can be used to do this. When you pass as argument a class in these decorators, the core will inject the override class instead of the original class at the injection points
 - YAML Application Properties: We use YAML format to provide a lot of [properties](documentation/the-way/core/application-properties.md) that can enable some feature or change their behavior

## Installing

TheWay is built for projects designed with NodeJs and Typescript.

**You can check how to create a NodeJs + Typescript project [here](documentation/guides/node-typescript-guide.md)**

Installing the TheWay:

*For Yarn*

    yarn add @umberware/the-way

*For Npm*

    npm install @umberware/the-way

**Remember to install @types/node as dev dependencies when you are using the typescript with Node**

## Getting Started

In this section, we will create a simple application that uses **TheWay**.

**It is imperative that you have: NodeJs installed and a NodeJs project configured to use typescript.
You can check how to configure Node.js to work with Typescript in this guide: [NodeJs With Typescript](./documentation/guides/node-typescript-guide.md)**

*Installing: @umberware/TheWay*

    npm install @umberware/the-way

*Creating: A Main class(src/main/main.ts)*

    import { Application, TheWayApplication, Inject, CoreLogger } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject logger: CoreLogger;

        public start(): void {
            this.logger.info('Hello World');
        }
    }

*Running: The Typescript source code (via [ts-node](https://www.npmjs.com/package/ts-node))*

    ts-node src/main/main.ts

*Build & Run: The final Javascript code*

 Build

    tsc

 Running the built code

    node disc/src/main/main.js


**You can check how to build a REST application in this guide: [TheWay: HeroesRest](documentation/guides/the-way-heroes-rest.md)**

**For more examples or guides, you can access the [The Way Examples Repository](https://github.com/umberware/the-way-examples#readme) or/and [Guides](documentation/index.md#guides)**

**Remember to install @types/node as dev dependencies when you are using the typescript with Node**

## Application Properties

This framework uses application properties in [Yaml Format](https://yaml.org/) and has a lot of properties that can be changed for your use. If no application properties is provided, the framework will use the **default** properties.
For more detail, please visit the [Application Properties Documentation](documentation/the-way/core/application-properties.md)

## Documentation

To access the full documentation you can access [this](documentation/index.md)