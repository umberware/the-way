const messages: { [key: string]: { [key: string]: string | number; } } = {
    'en': {
        'bad-request': 'Bad Request',
        'bad-request-code': 400,
        'building': 'Building instances and dependencies...',
        'building-class': 'Building instance for $',
        'building-dependencies-tree': 'Building dependencies tree...',
        'circular-dependency': 'Found a circular dependency between $ -> $',
        'configuring': 'Configuring some things...',
        'destroying': 'Descruction process started...',
        'destroyed': 'I\'m inevitable! Was destroyed every thing...',
        'error-occured-destroying': 'An error ocurred in the initialization process. Destroying...',
        'found-resource': 'Loading resources $',
        'initializing': 'Initializing the application...',
        'internal-error': 'Internal Error',
        'internal-server-error': 'Internal Server Error',
        'internal-server-error-code': 500,
        'is-not-the-way': 'Your application does not extend the class TheWayApplication',
        'not-allowed': 'Not Allowed',
        'not-allowed-code': 403,
        'not-found': 'Not Found',
        'not-found-code': 404,
        'not-found-dependency-constructor': 'Cannot inject property: $ in class $. Cannot acquire the metadata from property. Probably a circular dependency',
        'properties-not-found': 'Not found the properties gived. Will be used the default properties.',
        'properties-wrong-format': 'The properties gived is not acceptable.',
        'ready': 'The application is running [elapsed time $].',
        'registering-class': 'Registered: $ with type $',
        'registering-dependency-class': 'Registered dependency between: $ -> $',
        'registering-overridden-class': 'Registered overriden: $ -> $',
        'RU-001': 'Application not recognized',
        'RU-002': 'HttpServer is not found',
        'RU-003': 'File not found',
        'RU-004': 'Cannot inject',
        'RU-005': 'Instance not created',
        'RU-006': 'Not destroyed',
        'RU-007': 'Not configured',
        'scanning': 'Searching & Loading the resources...',
        'unauthorized': 'Not Authorized',
        'unauthorized-code': 401
    }
};

export class Messages {
    static language = 'en'
    static setLanguage(language: string): void {
        this.language = language;
    }
    private static get(name: string): string | number {
        const defaulMessages = messages.en;
        let languageMessages = messages[this.language];
        if (!languageMessages) {
            languageMessages = defaulMessages;
        }
        return (languageMessages[name]) ? languageMessages[name] : defaulMessages[name];
    }
    static getCodeMessage(name: string): number {
        return this.get(name) as number;
    }
    static getMessage(name: string, replacements?: Array<string>): string {
        let message = this.get(name) as string;

        if (replacements && (typeof message === 'string')) {
            for (const replace of replacements) {
                message = (message as string).replace('$', replace);
            }
        }

        return message;
    }
}
