
[![Version](https://img.shields.io/badge/Version-0.4.0-lightseagreen.svg)](https://www.npmjs.com/package/@nihasoft/the-way)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](https://raw.githubusercontent.com/nihasoft/the-way/master/LICENSE)
[![EsLint](https://img.shields.io/badge/EsLint-Enabled-green.svg)](https://raw.githubusercontent.com/nihasoft/the-way/master/the-way/.eslintrc)
[![Build Status](https://travis-ci.com/nihasoft/the-way.svg?branch=master)](https://travis-ci.com/nihasoft/the-way)
[![codecov](https://codecov.io/gh/nihasoft/the-way/branch/master/graph/badge.svg)](https://codecov.io/gh/nihasoft/the-way)
[![Donate](https://img.shields.io/badge/%24-Donate-blue.svg)](https://www.paypal.com/donate/?token=Ov4xNE4bAuZWCSF9e0BjGy75laGShREyS7BDFs-oQSwMsGOVEzDZAq9VDVNKmaCewqrBUW&country.x=BR&locale.x=BR)

# The Way
This library will allow your application to @Inject some classes and use more easily the @Rest with some decorators.
You can customize some behaviors with custom Classes and injecting this classes in the @Application decorator. Please, read the full documentation for more knowledge.
The examples in this readme can be viewed in the github in the [the-way-demos directory](https://github.com/nihasoft/the-way/tree/master/src/test).

Note: We support application properties with YAML format. See the section **Properties Configuration** and **Application Properties**.

# Features

    - More simple to map and use the Rest paths/methods concepts;
    - Rest injections like: bodyParam(for put and post), pathParam, header, queryParam and others;
    - Helpful decorators;
    - Object injection;
    - Class overridden (for injection);
    - With a configuration to retrieve the properties from an application.properties.yml;
    - And wonderful things =)

# Fast Setup
To use this library you only need:

    - Create a class and extend that class with TheWayApplication;
    - Decorate your class with @Application().

With that you can inject classes and use everything of the library **except** the  Rest decorators and the HttpService.
You can see more in the section **TheWayApplication** and **@Application**.

##### The fast example:
    import { TheWayApplication, Application } from '@nihasoft/the-way';
    ...

    @Application()
    export class Main extends TheWayApplication {
        ...
    }

## Using the HttpService
If you want to use the **RestDecorators** and the **HttpService** you must provide an application.properties.yml and the properties below(see more in the section **Application Properties**):

    the-way:
    ...
        server:
            enabled: true

Besides, this library allow you to generate token's with JWT to use this feature you MUST provide some application properties:

    the-way:
    ...
        server:
        ...
            security:
                user-key: '12345678901234567890123456789012'
                token-key: '12345678901234567890123456789034'

Where the keys MUST be 32 bytes like the example above.

## Customizing the things
You can customize the library components like SecurityService, ServerConfiguration and anothers. You only need extend the class  that will be overridden and decorating that respective class with the respective decorator like: **@Configuration(CLASS_TO_OVERRIDDEN)** or **@Service(CLASS_TO_OVERRIDDEN)** and defining the classes in the **@Application** decorator.

##### The Main class decorated with @Application

    import { Application } from '@nihasoft/the-way';
    ....
    import { CustomServerConfiguration } from './configuration/custom-server.configuration';
    ...
    @Application({
        custom: [
            CustomServerConfiguration
        ]
    })
    export class Main extends TheWayApplication {
        @Inject() restModule: RestModule;
        ...
    }
Where the custom property is an array of the classes that are **custom**.

##### The Customization of the ServerConfiguration class
    import { Configuration, ServerConfiguration } from '@nihasoft/the-way'
    ...
    @Configuration(ServerConfiguration)
    export class CustomServerConfiguration extends ServerConfiguration 
    ....

For the @Application decorator you can see the section **@Application** for the **@Configuration** or **@Service** you can see the respective section in this doc.

## Grouping the injections to be more clean
You can create a class that's groups the injections and Inject this group class into the main, with that the main class will be more clean.

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

    import { Application, Inject } from '@nihasoft/the-way'
    ...
    import { RestModule } from './rest/rest.module';
    ...
    import { CustomServerConfiguration } from './configuration/custom-server.configuration';
    ...
    @Application({
        custom: [
            CustomServerConfiguration
        ]
    })
    export class Main extends TheWayApplication {
        ...
        @Inject() restModule: RestModule
        ...
    }

With this code above the **UserRest** and the **HeroRest** will be injected in the context.

# TheWayApplication
When you want to use this library is mandatory to extends the **TheWayApplication** and decorate your main class with **@Application()**. When every is loaded, will be called the method **start(): void** of the TheWayApplication class, you can overridden this method as you want.

    import { TheWayApplication, Application } from '@nihasoft/the-way';
    ...

    @Application()
    export class Main extends TheWayApplication {
        ...
    }

# CORE
This class is the heart and mind of this library. 
The Core is reponsable to handle all the decorators of this library, instantiate and handler the instances for injection, configure the classes decorated with @Configuration and overridden the classes that must be overridden. When every thing is injected, instantiated and configured, the core tell with the **ready$** BehaviorSubject that's the application are fully loaded and ready to be executed. When a class is decorated with the @Configuration(see more in the **@Configuration** section), the core will watch the return of the method configure(an observable) to be warned when the configuration is completed, when all the classes decorated with @Configuration are configurated and all the injectios are made the ready$ will be true.

## Getting the Core instance
To get the core instance you only need to call the method: `CORE.getCoreInstance()`.

## Getting an instance by name
Some times we need to get an instance in runtime moment, you can do this using the method: `CORE.getCoreInstance().getInstanceByName<ServerConfiguration>('ServerConfiguration');`

## Destroying the core
You can DESTROY the core and all the "configurations" like: httpServer, database connections and more. To do that you only need to call the method `core.destroy()` or `CORE.getCoreInstance().destroy()`. Also, the destroyables classes **MUST** extends the **Destroyable**.
Note: The class **AbstractConfiguration** extends by default the **Destroyable**.

# Application Decorators
Rembember: when you want to use a class with the decorator **YOU MUST** "Inject" that class into the main class decorated with **@Application**. 

## @Application
This is necessary to the core knows when the application is fully loaded. With this decorator you can customize some behavior of this library with the **custom** property passing to the array the classes that you want do overriden, like **SecurityService** and **ServerConfiguration**.
Also, this decorator will **Automatically** build all the classes decorated with some library decorator and imported in the Main class and the Main class decorated with @Application. You can pass the property **automatic** = false to disable this behaviour. By default this parameter is true. When automatic is false, the library will build the classes when the classe decorated with **@Application** is created. 

##### The main class with the default behavior:

    import { TheWayApplication, Application } from '@nihasoft/the-way';
    ...

    @Application()
    export class Main extends TheWayApplication {
        ...
    }
The code above will enable all the The Way features to be used with the **default** implementation. Also, if server.enabled(in the application.properties.yml) the Rest decorators and the HttpServer will be enable too.

##### The main class with a custom implementation of the ServerConfiguration

    
    import { Application, Inject } from '@nihasoft/the-way'
    ...
    import { CustomServerConfiguration } from './configuration/custom-server.configuration';
    ...
    @Application({
        custom: [
            CustomServerConfiguration
        ]
    })
    export class Main extends TheWayApplication {
    ...
    }

    
The code above will enable all the The Way features. But the **ServerConfiguration** default implementation will be overriden with the **CustomServerConfiguration** implementation.

##### The main class with a custom implementation of the ServerConfiguration and MANUAL building

    
    import { Application, Inject } from '@nihasoft/the-way'
    ...
    import { CustomServerConfiguration } from './configuration/custom-server.configuration';
    ...
    @Application({
        custom: [
            CustomServerConfiguration
        ],
        automatic: false
    })
    export class Main extends TheWayApplication {
    ...
    }

    ...
    new Main();
The code above will enable all the The Way features. But the **ServerConfiguration** default implementation will be overriden with the **CustomServerConfiguration** implementation. Also, the **USER** must execute a **NEW to run the application**.


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
When you want to configure or prepare some thing, this decorator can help you. The classes decorated with this decoration will execute the method "configure" when the class is being instantiated. To use correctly this decorator your configure class **MUST** extends the **AbstractConfiguration**  and implement the method configure, besides that the class must have the **@Configuration()** decorator. Also, you can pass an argument(a class) to this decorator to be overridden, same behavior of **@Service** at this point.

##### CustomServerConfiguration: By the default this library will start a server in port 8081(when was passed the **HttpService**) the class below will override the property `port` to be 8080.

    import { Configuration, ServerConfiguration } from '@nihasoft/the-way'
    ...
    import { Observable, of } from 'rxjs';
    ...

    @Configuration(ServerConfiguration)
    export class CustomServerConfiguration extends ServerConfiguration{
        public configure(): Observable<boolean> {
            this.port = 8080;
            return of(true);
        }
    }

### ServerConfiguration
This class will create a http server (if enabled) using **Express**.

### PropertiesConfiguration
This library uses a property file in YAML format. The properties file load sequence is:
- We try to load an "external" file if is passed the argument: --properties;
- If is not passed the --properties argument we try to load a "project" properties in the root path of your project named with: 'application.properties.yml';

After this, we load the default properties and we merge this with the properties found in the file, preserving the properties passed. If no file is passed or found, the library will use the default properties.
You can **@Inject** the **PropertiesConfiguration** into your class to use the properties.

You can see the properties that the application uses at the section **Application Properties** or in the file [application.properties.yml](https://raw.githubusercontent.com/nihasoft/the-way/master/application.properties.yml).

Also, you can create your properties file with the name "application.properties.yml" in your project's root directory or an "external" application.properties.yml passing the --properties parameter with path of the file and the file name.


##### Passing an external properties file:
`node dist/main.js --properties=D:\\projects\\libs\\theway\\application.properties.yml`

##### Using the PropertiesConfiguration

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
This service is used to:

    - verifyToken: When method need a authenticated user;
    - verifyProfiles: When the claims has profiles and the method has profiles. With this, you can allow the method for only certain profiles;
    - generateToken: Used to generate the token. The argument is the TokenClaims with YOUR custom fields. 

If the profiles field is provided in the TokenClaims and the method contains profiles,  will validate if the "token claims" profiles provided can execute the method. 
The private keys for **CryptoService** and JWT are passed in application.properties (in the default implementation. You can customize this service and implement your behavior)

##### The properties 
    the-way:
        ...
            server:
            ...
                security:
                    user-key: '12345678901234567890123456789012'
                    token-key: '12345678901234567890123456789034'

##### A CustomSecurityService implementation

    import { SecurityService, Service } from '@nihasoft/the-way'
    ...
    @Service(SecurityService)
    export class CustomSecurityService extends SecurityService {
        ...
        @Inject() mongoDbService: MongoDbService;
        private userKey: string;
        private tokenKey: string;
        ...
        constructor() {
            this.loadKeysFromDatabase();
        }
        private loadKeysFromDatabase(): void {
            this.mongoDbService.findOne<SystemKeys>({active: true, type: 'system'}, 'key').subscribe(
                (key: SystemKeys) => {
                    this.userKey = key.user;
                    this.tokenKey = token.user;
                }, (error: Error) => {
                    this.logService.error(error);
                    throw new ApplicationException('Not found or Multiples SystemKeys', 'Internal Error', 'Ru-001');
                }
            );
        }
        ...
        protected getUserKey(): string {
            return this.userKey;
        }
        protected getTokenKey(): string {
            return this.tokenKey;
        }
        ....
    }
The code above override the default **SecurityService** to retrieve the keys from the database. You can customize every method in this class, you can also change the cipher algorithms, jwt to Oauth2.0.

##### Main class

    ...
    import { Application } from '@nihasoft/the-way'
    ...
    import { CustomSecurityService } from './service/custom-security.service';
    ...
    @Application({
        custom: [
            CustomServerConfiguration
        ]
    })
    export class Main extends TheWayApplication {
        ...
    }

### HttpService
When you want to use a httpserver this lib will enable your application to use more easily http and https with some decorators to make your life more simple.
The **HttpService** Will register the paths and enable the paths for execution. To use the httpService you need to flag = true the property enabled in the application.properties.yml.

    the-way:
    ...
        server:
            enabled: true


After this, your application will be enabled to use the **RestDecorators**.

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
You can inject the **@QueryParam**, **@TokemClaims** and **@PathParam** into your method.

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

##### Example: @Get with @PathParam, @TokemClaims and @QueryParam. This method the user must be logged in and has the profile "1"

    import { Get, PathParam, QueryParam, TokemClaims} from '@nihasoft/the-way'

    import { Observable, of } from 'rxjs';

    export class UserRest {
        ...
        @Get('/api/user/:id/tenants', true, [1])
        public getUserTenants(@PathParam('id') id: string, @QueryParam param: any, @TokemClaims user: any): Observable<Array<any>> {
            return of([]);
        }
        ...
    }

## @Post and @Put
You can inject the **@BodyParam**, **@TokemClaims** and **@PathParam** into you method.

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

## @Claims
Will decrypt the token getting the data(claims) and will inject the TokenClaims on the method. Example above.

## @Header
Will insert the request header received.

## @Request
Will insert the current request.

## @Response
Will insert the response.

# How to get a instance at Runtime
you can inject or get at runtime with the CORE object, example: `CORE.getCoreInstance().getInstanceByName<SecurityService>('SecurityService')`
    
# Application Properties

The current application properties:


    the-way:
        core:
            log: true
        log:
            level: 0
        server:
            enabled: true
            port: 8081
            api-endpoint: '/api'
            security:
                user-key: '12345678901234567890123456789012'
                token-key: '12345678901234567890123456789034'
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

Everything inside of the "the-way" is a property of this library and the **DEFAULT** values used in this library. If you want to use the application properties for your application, you should create a another "tag" brother of the "the-way". 
Also you can "override" the values of the properties above in your **application.properties.yml**.
When you create a application.properties.yml and you pass this to the library (placing the file in the root of your project ou using argument --properties for an application properties file external) will be merged, will be preserved the properties found in you application properties file.

The **core** property is vinculated to the **CORE** class. Actualy we have only the log sub property. This propery allow the log of the dependency tree, injection and information about the overriden classes.

The **log** is a property vinculated to the **LogService**. Actualy we have only the level property. The level property tells to the LogService what types of log will be logged.

The **server** is a property vincultated to the **ServerConfiguration**. Here we have multiples properties.
 - enabled: if true, the library will start a HttppServer;
 - port: is the port where the api and files will be served;
 - api-endpoint: is a property to tell what is the "rest" services base path;
 - security: is used in the default implementation of the security to generate token and cipher the user inside of the token
    - user-key: The key used to cipher the user using aes-256-cbc algorithmn;
    - token-key: The key for the JWT token;
 - file: is used when you want to serve some files:
    - enabled: is true when you want to serve files  too;
    - fallback: is a property to tell if needs to do the fallback to the index.html when the final user is requesting an application route, like Angular routes;
    - full: is used to determine if the path is absolute or not;
    - path: is where the files to be served are. You can pass an absolute path but need to set full = true;
    - static(optional): is used to serve files in a diffent path of the abtual. Here you can pass an absolute path setting full = true and putting the path. Also, you can pass a relative path. Note: The request for a file MUST have the /static in the path.
    - assets(optional): is used to serve files like images, fonts, json and anothers. Here you can pass an absolute path setting full = true and putting the path. Also, you can pass a relative path.
    Note: The request for a file MUST have the /assets in the path.