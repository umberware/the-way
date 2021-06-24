[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](https://github.com/umberware/the-way-examples/tree/master/examples/custom-security-rest/)

## The Way: CustomSecurityService

To use this guide you must have a project configured to use typescript and the libraries `@umberware/the-way` and `@types/node` installed.
You can check this [guide](node-typescript-guide.md) to configure.

For some reasons we want to create a custom behavior for some feature or re-implement a feature.
In this guide, we will create a custom security service to teach you how the overridden works in this framework.
Also, this example will exercise the sign/in and the authenticity verification. So, let's go!!!

### Summary

 - [Fist Step: A main class](#first-step-a-main-class)
 - [Custom Class: Creating a CustomCoreSecurityService](#custom-class-creating-a-customcoresecurityservice)
 - [SignRest: The sign/in and sign/verify operations](#signrest-the-signin-and-signverify-operations)
 - [Running](#running)
 - [Conclusion](#conclusion)

### First Step: A Main Class

The first step, is to create a main file for the bootstrap of your application

**Main:** *The main class(src/main/main.ts)*

    import { Application, TheWayApplication, Inject, CoreLogger } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
    @Inject logger: CoreLogger;

        public start(): void {
            this.logger.info('Custom Security Rest');
        }
    }

### Custom Class: Creating a CustomCoreSecurityService

One of the objectives of this guide is show how we can use the overridden mechanism of the framework.
So, we need to create a custom CoreSecurityService that will implement the methods: generateToken and the verifyAuthentication

**CustomCoreSecurityService:** *The customized CoreSecurityService(src/main/custom/custom-core-security.service.ts)*

    import { CoreLogger, CoreSecurityService, Inject, PathMapModel, Service, TokenClaims } from '@umberware/the-way';

    @Service(CoreSecurityService)
    export class CustomCoreSecurityService extends CoreSecurityService {
        @Inject logger: CoreLogger;
        /**
        * You can customize these methods to implement your user authenticity mechanisms.
        * Changing the default JWT to an OAUTH or another authentication method
        * */
        public generateToken(tokenClaims: TokenClaims | undefined): string {
            this.logger.info('My Custom Security Service Generate Token');
            return super.generateToken(tokenClaims);
        }
        public verifyAuthentication(fatherPath: PathMapModel, token?: string, profiles?: Array<any>): TokenClaims | undefined {
            this.logger.info('My Custom Security Service Authentication Verification');
            return super.verifyToken(fatherPath, token, profiles);
        }
    }

### SignRest: The sign/in and sign/verify operations

To check if the overridden it's applied, and the custom behavior it's called, we need to create a SignRest class to map the custom operations that will call the CustomCoreSecurityService.

The fist step, is to create a sign model to be the input for the sign/in rest operation

**SignModel:** *The sign model with the AUTH form fields(src/main/sign/model/sign.model.ts)*

    export interface SignModel {
        username: string;
        password: string;
    }

Now, we can create the SignRest class that will map the REST operations for the sign/in and the authenticity verification

**SignRest:** *The REST class tha will map the operations and call the CustomCoreSecurityService(src/main/sign/sign.rest.ts)*

    import {
        BadRequestException,
        BodyParam,
        Claims,
        CoreLogger,
        CoreSecurityService,
        Get,
        Inject,
        Post,
        Rest,
        TokenClaims
    } from '@umberware/the-way';

    import { SignModel } from './model/sign.model';

    @Rest( '/sign')
    export class SignRest {
    /*
    *   The CustomCoreSecurityService override the CoreSecurityService, so the injected instance will be a CustomCoreSecurityService
    */
    @Inject coreSecurity: CoreSecurityService;
    @Inject logger: CoreLogger;

        @Post('in')
        public signIn(@BodyParam sign: SignModel): string {
            if (!sign.password || !sign.username) {
                throw new BadRequestException('Username or Password is invalid');
            }
            return this.coreSecurity.generateToken({ username: sign.username });
        }
        @Get('verify', true)
        public verifyAuth(@Claims tokenClaims: TokenClaims): boolean {
            this.logger.info(tokenClaims.username);
            return true;
        }
    }

In the code above, we created a SignRest class that will map 2 REST operations with a dummy implementation

The 'sign/in' operation, is mapped with POST method and is used to generate a token for the user

The 'sign/verify' operation, is mapped with GET method and is marked to be executed only when has a logged user with a valid TOKEN.

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

It's important to know that the overridden mechanism will replace in every injection point the old class instance to the new class instance, so, in the example above
when the core needs to inject an instance of [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) will be injected a CustomCoreSecurityService instance.
Also, only the method [verifyAuthentication](documentation/the-way/core/service/core-security-service.md#method-verifyauthentication) is used in the core to check if the user is logged and valid.
You can validate the profiles in a custom implementation, you can change the default JWT for a OAUTH mechanism, you can create your behavior, and you only needs to implement the method described above to use
a CustomCoreSecurityService. Besides that, the [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) will be used when the mapped REST operations is marked to be executed only when has [logged user](documentation/the-way/core/decorator/rest-decorators.md).
When the [scan is enabled](documentation/the-way/core/application-properties.md#the-waycorescan) you don't need
to import your components decorated with some [core decorator](documentation/the-way/core/decorator/core-decorators.md), because it will be automatically registered when you call
your main class.
You can check the source code of this example [here](https://github.com/umberware/the-way-examples/tree/master/examples/custom-security-rest/).

**For more examples or guides, you can access the [The Way Examples Repository](https://github.com/umberware/the-way-examples#readme) or/and [Guides](documentation/index.md#guides)**