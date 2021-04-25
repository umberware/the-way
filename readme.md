[![Documentation](https://img.shields.io/badge/Documentation-lightseagreen.svg)](http://the-way.umberware.com)
[![Changelog](https://img.shields.io/badge/Changelog-lightseagreen.svg)](./changelog.md)
[![Examples](https://img.shields.io/badge/Examples-lightseagreen.svg)](https://github.com/umberware/the-way-examples)
[![npm version](https://badge.fury.io/js/%40umberware%2Fthe-way.svg)](https://badge.fury.io/js/%40umberware%2Fthe-way)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](https://raw.githubusercontent.com/umberware/the-way/master/LICENSE)
[![EsLint](https://img.shields.io/badge/EsLint-Enabled-green.svg)](https://raw.githubusercontent.com/umberware/the-way/master/.eslintrc)
[![Build Status](https://travis-ci.com/umberware/the-way.svg?branch=master)](https://travis-ci.com/umberware/the-way)
[![codecov](https://codecov.io/gh/umberware/the-way/branch/master/graph/badge.svg?token=JDRUQC0T9A)](https://codecov.io/gh/umberware/the-way)
[![Donate](https://img.shields.io/badge/%24-Donate-blue.svg)](http://the-way.umberware.com/donate)

# The Way

To improve the life cycle of the development in Node.js in a REST and/or POG concept, this framework is the way.
With this framework you can build a REST application more easily, you can make singletons and inject this singletons in another class, you can configure and manipulate yours class
more easily, in other words, the sky is not the limit!

## Summary

 - [Installing](#installing)
 - [Features](#features)
 - [NodeJs+Typescript Guide](./documentation/node-typescript-guide.md)
 - [Application Properties](./documentation/application-properties.md)

## Installing

This framework is built for NodeJs with Typescript and you need a project configured. You can check how to create a NodeJs + Typescript project [here](./documentation/node-typescript-guide.md).

Installing the TheWay:

*For Yarn*

    yarn add @umberware/the-way

*For Npm*

    npm install @umberware/the-way

## Features

With this framework you can elevate the life cycle of the development in Node.js with a lot of features, and the principles are:

 - All in a Core: The framework will find the files that contains decorators of this framework and automatically import and process these decorators and configure when that class need to be configured
 - REST mapping and concepts more intelligible and concise: For that we use decorators to abstract some things and configure automatically the [express](https://github.com/expressjs/express) routes, security and others
 - Class Injection & Singleton: When a class is decorated with some this framework decorators, we will instantiate and configure this class and allow this instance to be injected in another component
 - Customizing & Overriding: If for some reason you want to change a class behavior you can override that class and inject you custom class in the old class injections points. With application properties or POG, you can customize some things for your application.
 - Automatic HTTP and HTTPS server: We use the [express](https://github.com/expressjs/express) for build a http and/or https server and you can customize some properties for this server
