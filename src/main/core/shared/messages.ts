const messages: { [key: string]: { [key: string]: string | number; } } = {
    'en': {
        'initializing': 'Initializing the application...',
        'building': 'Building instances and dependecies...',
        'scanning': 'Searching & Loading the resources...',
        'configuring': 'Configuring some things...',
        'ready': 'The application is running [elapsed time $].',
        'properties-not-found': 'Not found the properties gived. Will be used the default properties.',
        'properties-wrong-format': 'The properties gived is not acceptable.',
        'internal-error': 'Internal Error',
        'is-not-the-way': 'Your application does not extend the class TheWayApplication',
        'not-found': 'Not Found',
        'not-found-code': 404,
        'internal-server-error': 'Internal Server Error',
        'internal-server-error-code': 500,
        'unauthorized': 'Not Authorized',
        'unauthorized-code': 401,
        'not-allowed-code': 403,
        'not-allowed': 'Not Allowed',
        'bad-request': 'Bad Request',
        'bad-request-code': 400,
        'RU-001': 'Application not recognized',
        'RU-002': 'HttpServer is not found',
        'RU-003': 'File not found',
        'RU-004': 'Cannot inject',
        'RU-005': 'Instance not created',
        'RU-006': 'Not destroyed',
        'RU-007': 'Not configured'
    }
};

export class Messages {
    static language = 'en'
    static setLanguage(language: string): void {
        this.language = language;
    }
    static getMessage(name: string): string | number {
        const defaulMessages = messages.en;
        let languageMessages = messages[this.language];
        if (!languageMessages) {
            languageMessages = defaulMessages;
        }

        return (languageMessages[name]) ? languageMessages[name] : defaulMessages[name];
    }
}
