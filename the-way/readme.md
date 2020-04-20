
[![Version](https://img.shields.io/badge/Version-0.0.1-lightseagreen.svg)](https://www.npmjs.com/package/@nihasoft/the-way)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](https://raw.githubusercontent.com/nihasoft/bpmn-flows/master/LICENSE)
[![Build Status](https://travis-ci.org/nihasoft/the-way.svg?branch=master)](https://travis-ci.org/nihasoft/bpmn-flows)
[![Donate](https://img.shields.io/badge/%24-Donate-blue.svg)](https://www.paypal.com/donate/?token=Ov4xNE4bAuZWCSF9e0BjGy75laGShREyS7BDFs-oQSwMsGOVEzDZAq9VDVNKmaCewqrBUW&country.x=BR&locale.x=BR)

# The Way
Is a way to Inject some dependencies and turn more easily the utilization of Rest concepts. Please read ALL this document for more knowledge.

# HttpService
When you want a httpserver, this lib will enable your application to use more easily http and https with some decorators to make your life more simple.
The **HttpService** Will register the paths and enable the paths for execution. To use the httpService you need to put inside of your **@Application**.

**Example:**

    import { Application } from '@nihasoft/the-way'
    ...
    @Application(HttpService)
    export class Main {
        ...
    }

After this, your application will be enabled to use the **RestDecorators**. Besides that, you can pass a customized class to the **@Application** but the class SHOULD extends the HttpService and **@Inject** the **SecurityService**, **ServerConfiguration** and **LogService**

# Decorators
Rembember: when you want to use a class with the decorators **YOU MUST** "Inject" that class into the class decorated with **@Application**. For more organization you can create a another class that "Injects" your injectables. 

**Example:**

Your **RestModule**
    import { Inject } from '@nihasoft/the-way'

    import { UserRest } from './user.rest';
    import { HeroRest } from './hero.rest';

    export class RestModule {
        @Inject() userRest: UserRest;
        @Inject() heroRest: HeroRest;
        ...
    }

Your class decorated with **@Application**

    ...
    import { HttpService }from '@nihasoft/the-way/core/service/http/http.service';
    import { Application, Inject } from '@nihasoft/the-way'
    ...
    import { RestModule } from './rest/rest.module';
    ...

    @Application(HttpService)
    export class Main {
        ...
        @Inject() restModule: RestModule
        ...
    }

With this code above the **UserRest** and the **HeroRest** will be injected in the context.


## @Application
This is necessary to the core knows when the application is fully loaded.
If you pass inside of **@Application** a class that extends or are HttpService, the application will start an express server and enable the `Rest Decorators`

**Example:**

    ...
    import { Application, Inject } from '@nihasoft/the-way'
    ...

    @Application(HttpService)
    export class Main {
        ...
    }

## @Inject
This class will **inject** the instance of the class wanted. If exists a instance of the wanted class will be injected this instance or if doesn't exists, so will be created a new instance and injected.

**Example:**

    import { Inject } from '@nihasoft/the-way'

    import { UserRest } from './user.rest';
    import { HeroRest } from './hero.rest';

    export class RestModule {
        @Inject() userRest: UserRest;
        @Inject() heroRest: HeroRest;
    }

The code above, will create a **UserRest** and **HeroRest** to be injected in **RestModule** class.

## @Configuration
When you want to configure or prepare some thing, this decorator can help you. The classes decorated with this decoration **MUST** extends the **AbstractConfiguration** and implement the method configure. The configure method will be called when the class be instantiated.

**Example:**
    
    import { Inject, Configuration } from '@nihasoft/the-way'

    @Configuration()
    export class ServerConfiguration extends AbstractConfiguration{
        ... 
        public configure(): void {
            this.initializeExpress();
        }
        ...
    }


## @Service
When you make a service decorate your class with that. You can
pass a Class as argument that will be "overrided" when core inject, that means if you have a classB and you want to use the classB in the place of classA, you can do this using this decorator. Remember, in typescript the decorators are EVALUATED in import moment.

**Example:**

    import { Service } from '@nihasoft/the-way'

    import { ClassService } from './class.service';

    @Service(ClassService)
    export class Class2Service {
        ...
    }

## The Rest Decorators
With the decorators below you can define an endpoint, make this endpoint be allowed only if the user is logged in and allow only if the user has a certain profile. Every method decorated with the decorators below **MUST** return an **Observable** of **RXJS**.

### @Get and @Del
You can inject the **@QueryParam**, **@RequestingUser** and **@PathParam** into you method.

**Example: @Get with @PathParam**

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

**Example: @Get with @PathParam, @RequestingUser and @QueryParam. This method the user must be logged in and has the profile "1"**

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

### @Post and @Put
You can inject the **@BodyParam**, **@RequestingUser** and **@PathParam** into you method.

**Example: @Post with @BodyParam**

    import { SecurityService } from '@nihasoft/the-way/core/service/security.service';
    import { Inject, Post, BodyParam } from '@nihasoft/the-way'

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

### @BodyParam
Will read the body of the request and inject into method. Example above.

### @QueryParam
Will read all queryparam of the request and build an object with that. Example above.

### @PathParam
Will read pathparam of the request and put into method using the pathparam name (:param, :id...). Example above;

### @RequestingUser
Will decrypt the token getting the user of token, after that, will inject the user on the method. Example above.

# CryptoService
This service is used to cypher and decypher the user inside the token. It's called in **SecurityService**.

# ServerConfiguration
By the default, when you put HttpService on @Application, this will inject the httpService and configure the ServerConfiguration.
This class will create a http server using **Express**. You can customize this behaviour creating your **HttpService** and injecting a class that extends the **ServerConfiguration**. Note: Your custom **HttpService** and your **ServerConfiguration** must be an extends of the respective class.


# Security Service
This service is used to verify token(when method need a authenticated user), verify user profiles (when method is allowed only for certain profiles) and to generate the token. The private keys for **CryptoService** and JWT it's harded coded and **YOU** must override this with your keys for more segurance.
To do that, you only need to extend this class and set your **TOKEN_KEY** and **USER_PRIVATE_KEY** and inject this class insine the decoration @Application.

**Example:**
### CustomSecurityService

    import { SecurityService } from '../../core/service/security.service';
    import { Service } from '../../core/decorator';

    @Service(SecurityService)
    export class CustomSecurityService extends SecurityService {
        protected TOKEN_KEY = 'MY-CUSTOM-KEY-IS-SO-BEAUTIFULL-BUT-DARTH-VADER-IS-THE-KING-WTH';
        protected USER_PRIVATE_KEY = 'MY-CUSTOM-KEY-IS-SO-BEAUTIFULL-BUT-DARTH-VADER-IS-THE-KING-WTH';
    }

### Main (@Application)
**IMPORTANT: In typescript the decorators are evaluated in the import moment. So, to the @Injection() work correctly YOU MUST IMPORT YOUR CLASS BEFORE THE ANOTHERS CLASS THAT CONTAINS DECORATOR, FOR THE INJECTION WORK CORRECTLY OR you can "inject" at runtime with the CORE object, example: `CORE.getInstance().getInjectableByName('SecurityService') as SecurityService`**
    
    import { CustomSecurityService } from './service/custom-security.service';
    ...
    import { Application, Inject } from '../core/decorator';
    import { HttpService } from '../core/service/http/http.service';
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