[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](https://github.com/umberware/the-way-examples/tree/master/examples/internationalization/)

## The Way: Internationalization

To use this guide you must have a project configured to use typescript and the libraries `@umberware/the-way` and `@types/node` installed.
You can check this [guide](node-typescript-guide.md) to configure.

In this guide we will teach how to add a new language and use this language in your application.

### Summary

 - [Fist Step: A main class](#first-step-a-main-file)
 - [CustomMessagesConfiguration: Preparing another languages](#custommessagesconfiguration-preparing-another-languages)
 - [Main: Adjusting to use the new languages](#main-adjusting-to-use-the-new-languages)
 - [Running](#running)
 - [Conclusion](#conclusion)

### First Step: A main file

The first step, is to create a main file for the bootstrap of your application

**Main:** *The main class(src/main/main.ts)*

    import { Application, TheWayApplication, Inject, CoreLogger, CoreMessageService } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject logger: CoreLogger;

        public start(): void {
            this.logger.info(CoreMessageService.getMessage('hello-world'));
        }
    }

With the code above, will be consoled `undefined`  when you [run](#running), because the 'hello-world' is not defined in the language 'en' in the [CORE_MESSAGES](documentation/the-way/core/shared/constant/core-messages-constant.md).

### CustomMessagesConfiguration: Preparing another languages

In the above section, we tried to use a message that is not defined. In this section, we create a class that will prepare the [CORE_MESSAGES](documentation/the-way/core/shared/constant/core-messages-constant.md)
with new languages and new messages.

**CustomMessagesConfiguration:** *A Configurable Class(src/main/shared/configuration)*

    import { Configurable, Configuration, CORE_MESSAGES } from '@umberware/the-way';

    @Configuration()
    export class CustomMessagesConfiguration extends Configurable {
        public configure(): void {
            CORE_MESSAGES['pt'] = {
                'hello-world': 'Olá mundo'
            };
            CORE_MESSAGES['en']['hello-world'] = 'Hello World';
            CORE_MESSAGES['es'] = {
                'hello-world': 'Hola Mundo'
            }
        }
        public destroy(): void {}
    }

In the code above, we create two languages in the CORE_MESSAGES object and a new "message" for "en" language. Now, we are able to use the new languages and message.
Also, you can change the code above to pass a JSON object to a language key and with this, you can have a file per-language for example.

### Main: Adjusting to use the new languages

In this example, we are using the Main class to get the new languages and messages, but you can use the languages in every place after the [Core initialization](documentation/the-way/core/core.md#step-initialization)


**Main:** *Adjusted main (src/main/main.ts)*

    import { Application, TheWayApplication, Inject, CoreLogger, CoreMessageService } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject logger: CoreLogger;

        public start(): void {
            this.logger.info(CoreMessageService.getMessage('hello-world'));
            CoreMessageService.setLanguage('pt');
            this.logger.info(CoreMessageService.getMessage('hello-world'));
            CoreMessageService.setLanguage('es')
            this.logger.info(CoreMessageService.getMessage('hello-world'));
        }
    }

When you [run](#running) the adjusted main class, the output will log the en, pt and es "hello-world".

    [INFO] Hello World
    [INFO] Olá mundo
    [INFO] Hola Mundo

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

With TheWay framework you can easily prepare your project for internationalization.
You can set the language with the [the-way.core.language](documentation/the-way/core/application-properties.md#the-waycorelanguage) property

You can check the source code of this example [here](https://github.com/umberware/the-way-examples/tree/master/examples/internationalization/).

**For more examples or guides, you can access the [The Way Examples Repository](https://github.com/umberware/the-way-examples#readme) or/and [Guides](documentation/index.md#guides)**