## The Way: Internationalization

In this guide we will teach how to add a new language and use this language in your application.

*Main: A Main File (src/main/main.ts)*

    import { Application, TheWayApplication, Inject, CoreLogger, CoreMessageService } from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject logger: CoreLogger;

        public start(): void {
            this.logger.info(CoreMessageService.getMessage('hello-world'));
        }
    }

*Running*

    ts-node src/main/main.ts

With the code above, will be consoled `undefined` because the 'hello-world' is not defined in the language 'en' in the [CORE_MESSAGES](documentation/the-way/core/shared/constant/core-messages-constant.md).

So, let's create a [configurable](documentation/the-way/core/shared/abstract/configurable.md) class to prepare the [CORE_MESSAGES](documentation/the-way/core/shared/constant/core-messages-constant.md) with
new messages and languages

*CustomMessagesConfiguration: A Configurable Class(src/main/shared/configuration)*

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

**Note:** You can pass a JSON object to a language key to have a file per-language

*Main: Adjusting (src/main/main.ts)*

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

*Running*

    ts-node src/main/main.ts

With the main class adjusted, the new output will log the en, pt and es "hello-world".

    [INFO] Hello World
    [INFO] Olá mundo
    [INFO] Hola Mundo

**Note:** You can set the language with the [the-way.core.language](documentation/the-way/core/application-properties.md#the-waycorelanguage) property

You can check the source code of this example [here](https://github.com/umberware/the-way-examples/tree/master/examples/internationalization/).

**For more examples or guides, you can access the [The Way Examples Repository](https://github.com/umberware/the-way-examples#readme) or/and [Guides](documentation/index.md#guides)**