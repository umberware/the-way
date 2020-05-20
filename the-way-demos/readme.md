
[![Version](https://img.shields.io/badge/Version-0.2.3-lightseagreen.svg)](https://www.npmjs.com/package/@nihasoft/the-way)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](https://raw.githubusercontent.com/nihasoft/bpmn-flows/master/LICENSE)
[![Build Status](https://travis-ci.org/nihasoft/the-way.svg?branch=master)](https://travis-ci.org/nihasoft/bpmn-flows)
[![Donate](https://img.shields.io/badge/%24-Donate-blue.svg)](https://www.paypal.com/donate/?token=Ov4xNE4bAuZWCSF9e0BjGy75laGShREyS7BDFs-oQSwMsGOVEzDZAq9VDVNKmaCewqrBUW&country.x=BR&locale.x=BR)

# The Way
This library will allow your application to @Inject some classes and use more easily the @Rest with some decorators.
You can customize some behaviors with custom Classes and injecting this classes in the @Application decorator. Please, read the full documentation for more knowledge.
The examples in this readme can be viewed in the github in the [the-way-demos directory](https://github.com/nihasoft/the-way/tree/master/the-way-demos)

Note: We support application properties with YAML format. See the section **Properties Configuration** and **Application Properties**.

# Application Decorators
Rembember: when you want to use a class with the decorator **YOU MUST** "Inject" that class into the main class decorated with **@Application**. 
You can create a class that's groups the injections and Inject this group class into the main, with that the main class will be more clean.

##### Example:

##### The RestModule: a class that will group the "rest" classes

    import { Inject } from '@nihasoft/the-way'

    import { UserRest } from './user.rest';
    import { HeroRest } from './hero.rest';

    export class RestModule {
        @Inject() userRest: UserRest;
        @Inject() heroRest: HeroRest;
        ...
    }

##### The Main: decorated with **@Application** will be inject the **RestModule**

    import { HttpService, Application, Inject } from '@nihasoft/the-way'
    ...
    import { CustomSecurityService } from './service/custom-security.service';
    ...
    import { RestModule } from './rest/rest.module';
    ...
    @Application(
        HttpService, 
        CustomSecurityService
    )
    export class Main {
        ...
        @Inject() restModule: RestModule
        ...
    }

With this code above the **UserRest** and the **HeroRest** will be injected in the context.

## @Application
This is necessary to the core knows when the application is fully loaded.
When is passed inside of the main class decorated with **@Application** a class of type HttpService or an extension of that, the library will enable the `Rest Decoratos` and will start an **express** server.
Besides that you can pass anothers classes inside of **@Application**. For more information about the **HttpService** see the section of this theme.

##### Example:

    ...
    import { HttpService, Application, Inject } from '@nihasoft/the-way'
    ...
    import { CustomSecurityService } from './service/custom-security.service';
    ...
    @Application(
        HttpService, 
        CustomSecurityService
    )
    export class Main {
        ...
    }

## @Inject
When you want to **Inject** some class into your class this decorator do it for you. If exists a instance of the wanted class will be injected this instance or if doesn't exists, so will be created a new instance and injected.

##### Example:

    import { Inject } from '@nihasoft/the-way'

    import { UserRest } from './user.rest';
    import { HeroRest } from './hero.rest';

    export class RestModule {
        @Inject() userRest: UserRest;
        @Inject() heroRest: HeroRest;
    }

The code above, will create a **UserRest** and **HeroRest** to be injected in **RestModule** class.

## @Configuration
When you want to configure or prepare some thing, this decorator can help you. The classes decorated with this decoration will execute the method "configure" when the class is being instantiated. To use correctly this decorator your configure class **MUST** extends the **AbstractConfiguration**  and implement the method configure, besides that the class must have the @Configuration() decorator. Also, you can pass an argument(a class) to this decorator to be overridden, same behavior of **@Service** at this point.

##### Example:

##### CustomServerConfiguration: By the default this library will start a server in port 8081(when was passed the **HttpService**) the class below will override the property `port` to be 8080.

    import { Configuration, ServerConfiguration } from '@nihasoft/the-way'

    @Configuration(ServerConfiguration)
    export class CustomServerConfiguration extends ServerConfiguration{
        public configure(): void {
            this.port = 8080;
        }
    }

##### The main class:

    import { Application, HttpService } from '@nihasoft/the-way';
    import { CustomServerConfiguration } from './configuration/custom-server.configuration';
    ...
    import { RestModule } from './rest-server/rest.module';
    ...
    @Application(
        CustomServerConfiguration,
        HttpService
    )
    export class Main {
        @Inject() restModule: RestModule;
        ...
    }

### ServerConfiguration
By the default, when you put HttpService on @Application, this will inject the httpService and configure the ServerConfiguration.
This class will create a http server using **Express**. You can customize this behavior creating your **HttpService** and injecting a class that extends the **ServerConfiguration**. Note: Your custom **HttpService** and your **ServerConfiguration** must extends the respective class.

### PropertiesConfiguration
This library uses a property file in YAML format. The properties file load sequence is:
- We try to load an "external" file if is passed the argument: --properties;
- If is not passed the --properties argument we try to load a "project" properties in the root path of your project named with: 'application.properties.yml';

After this, we load the default properties and we merge this with the properties found in the file, preserving the properties passed. If no file is passed or found, the library will use the default properties.
You can **@Inject** the **PropertiesConfiguration** into your class to use the properties.

You can see the properties that the application uses at the section **Application Properties** or in the file [application.properties.yml](https://github.com/nihasoft/the-way/blob/master/the-way/application.properties.yml).

Also, you can create your properties file with the name "application.properties.yml" in your project's root directory or an "external" application.properties.yml passing the --properties parameter with path of the file and the file name.



##### Example: Passing an external properties file:
`node dist/main.js --properties=D:\\projects\\libs\\theway\\application.properties.yml`

##### Example: Using the PropertiesConfiguration

    import { Configuration, ServerConfiguration, PropertiesConfiguration, Inject } from '@nihasoft/the-way'

    @Configuration(ServerConfiguration)
    export class CustomServerConfiguration extends ServerConfiguration {
        @Inject() propertiesConfiguration: PropertiesConfiguration;

        public configure(): void {
            console.log('The old port is: ' + this.getPropertiesPort());
            this.port = 8080;
        }

        public getPropertiesPort(): number {
            return this.propertiesConfiguration.properties['the-way'].server.port as number;
        }
    }


## @Service
This decorator is designed for yours services. You can pass to this decorator an argument(the class to be overrided) to tell to the core that your service class will override a class, that means when the core is injecting the ClassA but this class was overridden by Class B, so the core will inject the ClassB.

##### Example:

    import { Service } from '@nihasoft/the-way'

    import { ClassService } from './class.service';

    @Service(ClassService)
    export class Class2Service {
        ...
    }

### Security Service
This service is used to verify token(when method need a authenticated user), verify user profiles (when method is allowed only for certain profiles) and to generate the token. The private keys for **CryptoService** and JWT it's harded coded and **YOU** must override this with your keys for more segurance.
To do that, you only need to extend this class and set your **TOKEN_KEY** and **USER_PRIVATE_KEY** and inject this class inside of you main class decorated with **@Application**.

##### Example: 
##### CustomSecurityService

    import { SecurityService, Service } from '@nihasoft/the-way'

    @Service(SecurityService)
    export class CustomSecurityService extends SecurityService {
        protected TOKEN_KEY = 'MY-CUSTOM-KEY-IS-SO-BEAUTIFULL-BUT-DARTH-VADER-IS-THE-KING-WTH';
        protected USER_PRIVATE_KEY = 'MY-CUSTOM-KEY-IS-SO-BEAUTIFULL-BUT-DARTH-VADER-IS-THE-KING-WTH';
    }

##### Main class

    ...
    import { HttpService, Application, Inject } from '@nihasoft/the-way'
    ...
    import { CustomSecurityService } from './service/custom-security.service';
    ...
    import { RestModule } from './rest/rest.module';
    ...
    @Application(
        HttpService, 
        CustomSecurityService
    )
    export class Main {
        ...
        @Inject() restModule: RestModule;
        ...
    }

### HttpService
When you want to use a httpserver this lib will enable your application to use more easily http and https with some decorators to make your life more simple.
The **HttpService** Will register the paths and enable the paths for execution. To use the httpService you need to put inside of your main class decorated with **@Application**. Also, you should put too a class that extends the class **SecurityService** setting your **TOKEN_KEY** and **USER_PRIVATE_KEY**. 

##### Example:

    ...
    import { HttpService, Application, Inject } from '@nihasoft/the-way'
    ...
    import { CustomSecurityService } from './service/custom-security.service';
    ...
    @Application(
        HttpService, 
        CustomSecurityService
    )
    export class Main {
        ...
    }

After this, your application will be enabled to use the **RestDecorators**. Besides that, you can pass a customized class to the **@Application** but the class SHOULD extends the HttpService and **@Inject** the **SecurityService**, **ServerConfiguration** and **LogService**

### CryptoService
You can use this service to: generate hashes, cipher, decipher and generate randomHash. You can use the algorithmns provided by **Crypto** from Node.js like: aes-cbc, aes-ecb, for hashes: Sha512, Sha256, MD5 and others.
To Cipher and Decipher you can use the methods:

    - cipherIv and DecipherIv when you want to use IV random buffer like: aes-256-cbc;
    - cipher and decipher when you don't want to use IV random buffer like: aes-256-ecb;
    - cipherWithRsa and decipherWithRsa when you want to use the RSA encryption and decryption.

To generate Hashes you can use the methods:
    - hash when you want to hash some data;
    - randomHash when you want to generate a random hash =).

This service is used to cipher and decipher the user inside the token. It's called in **SecurityService**.

# The Rest Decorators
With the decorators below you can define an endpoint, make this endpoint be allowed only if the user is logged in and you can allow the rest method if the user has a certain profile. Every method decorated with the decorators below **MUST** return an **Observable** of **RXJS**.

## @Get and @Del
You can inject the **@QueryParam**, **@RequestingUser** and **@PathParam** into your method.

##### Example: @Get with @PathParam

    import { Get, PathParam} from '@nihasoft/the-way'

    import { Observable, of } from 'rxjs';

    export class UserRest {
        ...
        @Get('/api/user/:id')
        public getUser(@PathParam('id') id: string): Observable<any> {
            return of({
                username: "Hanor",
                profiles: [0, 1],
                id: id
            });
        }
        ...
    }

##### Example: @Get with @PathParam, @RequestingUser and @QueryParam. This method the user must be logged in and has the profile "1"

    import { Get, PathParam, QueryParam, RequestingUser} from '@nihasoft/the-way'

    import { Observable, of } from 'rxjs';

    export class UserRest {
        ...
        @Get('/api/user/:id/tenants', true, [1])
        public getUserTenants(@PathParam('id') id: string, @QueryParam param: any, @RequestingUser user: any): Observable<Array<any>> {
            return of([]);
        }
        ...
    }

## @Post and @Put
You can inject the **@BodyParam**, **@RequestingUser** and **@PathParam** into you method.

##### Example: @Post with @BodyParam

    import { SecurityService, Inject, Post, BodyParam } from '@nihasoft/the-way'

    import { Observable, of } from 'rxjs';

    export class UserRest {
        ...
        @Inject() securityService: SecurityService;
        ...
        @Post('/api/sign/in')
        public signIn(@BodyParam signIn: any): Observable<any> {
            const user = {
                username: "Hanor",
                profiles: [0, 1, 2],
                id: id
            };
            return of({
                user: user,
                token: this.securityService.generateToken(user)
            });
        }
        ...
    }

## @BodyParam
Will read the body of the request and inject into method. Example above.

## @QueryParam
Will read all queryparam of the request and build an object with that. Example above.

## @PathParam
Will read pathparam of the request and put into method using the pathparam name (:param, :id...). Example above;

## @RequestingUser
Will decrypt the token getting the user of token, after that, will inject the user on the method. Example above.

# How to get a instance at Runtime
you can inject or get at runtime with the CORE object, example: `CORE.getInstance().getInjectableByName('SecurityService') as SecurityService`
    
# Application Properties

The current application properties:

    the-way:
        core:
            log: true
        log:
            level: 0
        server:
            port: 8080
            api-endpoint: '/api'
            file:
                enabled: true
                fallback: true
                full: false
                path: '/dist/web-interface'
                static: 
                    path: ''
                    full: false
                assets: 
                    path: ''
                    full: false

Everything inside of the "the-way" is a property of this library and the **DEFAULT** values used in this library. If you want to use the application properties for your application, you should create a another "tag" brother of the "the-way". 
Also you can "override" the values of the properties above in your **application.properties.yml**.
When you create a application.properties.yml and you pass this to the library (placing the file in the root of your project ou using argument --properties for an application properties file external) will be merged, will be preserved the properties found in you application properties file.

The **core** property is vinculated to the **CORE** class. Actualy we have only the log sub property. This propery allow the log of the dependency tree, injection and information about the overriden classes.

The **log** is a property vinculated to the **LogService**. Actualy we have only the level property. The level property tells to the LogService what types of log will be logged.

The **server** is a property vincultated to the **ServerConfiguration**. Here we have multiples properties.
 - port: is the port where the api and files will be served;
 - api-endpoint: is a property to tell what is the "rest" services base path;
 - file: is used when you want to serve some files:
    - enabled: is true when you want to serve files  too;
    - fallback: is a property to tell if needs to do the fallback to the index.html when the final user is requesting an application route, like Angular routes;
    - full: is used to determine if the path is absolute or not;
    - path: is where the files to be served are. You can pass an absolute path but need to set full = true;
    - static(optional): is used to serve files in a diffent path of the abtual. Here you can pass an absolute path setting full = true and putting the path. Also, you can pass a relative path. Note: The request for a file MUST have the /static in the path.
    - assets(optional): is used to serve files like images, fonts, json and anothers. Here you can pass an absolute path setting full = true and putting the path. Also, you can pass a relative path.
    Note: The request for a file MUST have the /assets in the path.