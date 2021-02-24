export const MESSAGES: { [key: string]: { [key: string]: string | number; } } = {
    'en': {
        'before-initialization': 'Before Initialization: Preparing the application...',
        'before-initialization-cannot-inject': 'Before Initialization: The class $ cannot be injected. Only The Core PropertiesHandler can be injected.',
        'before-initialization-cannot-register': 'Before Initialization: Core class cannot be overriden $.',
        'before-initialization-cannot-override-twice': 'Before-initialization: it is not possible to overwrite more than once. Was registered the overridden $ as $. The current is $.',
        'before-initialization-cannot-scan': 'Before Initialization: Cannot scan files with the provided path $.',
        'before-initialization-circular-dependency': 'Before Initialization: Found a circular dependency between $ -> $.',
        'before-initialization-found-resource': 'Before Initialization: Loading resources $',
        'before-initialization-is-not-the-way': 'Your application does not extend the class TheWayApplication',
        'before-initialization-not-found-dependency-constructor': 'Before Initialization: Cannot inject property -> $ in class $. ' +
            'Cannot acquire the metadata from property. Probably a circular dependency',
        'before-initialization-properties-not-gived': 'Before Initialization: Not gived a file properties. Will be used the default properties.',
        'before-initialization-properties-not-valid': 'Before Initialization: The provided application properties is not valid.',
        'before-initialization-registering-class': 'Before Initialization: Registered -> $ with type $',
        'before-initialization-registering-dependency-class': 'Before Initialization: Registered dependency between -> $ into $',
        'before-initialization-registering-overridden-class': 'Before Initialization: Registered overriden -> $ as $',
        'before-initialization-scanning': 'Before Initialization: Searching & Loading the resources...',
        'destruction-destroying': 'Desctruction: Started...',
        'destruction-destroyed': 'Desctruction: I\'m inevitable! Was destroyed every thing. CYA!',
        'destruction-destroyed-with-error': 'Destruction: An error ocurred in the destruction step. Error $.',
        'destruction-error-occured': 'Destruction: An error ocurred in the initialization step.',
        'initialization': 'Initialization: Starting...',
        'initialization-building-application-class': 'Initialization: Building application instance...',
        'initialization-building-dependencies-tree': 'Initialization: Building dependencies tree...',
        'initialization-building-core-instances': 'Initialization: Building core instances...',
        'initialization-building-instance': 'Initialization: Building instance -> $',
        'initialization-building-instances': 'Initialization: Building instances...',
        'initialization-configuration': 'Initialization: Executing configurables...',
        'initialization-dependencies-tree': 'Initialization: Dependencies tree\n $',
        'initialization-done': 'Initialization: The application is running [elapsed time $].',
        'initialization-injection': 'Initialization: Injected $ into $.$.',
        'initialization-resolving-tree': 'Initialization: Providing instances for dependency tree...',
        'TW-001': 'Application not recognized',
        'TW-002': 'HttpServer is not found',
        'TW-003': 'File not found',
        'TW-004': 'Cannot inject',
        'TW-005': 'Instance not created',
        'TW-006': 'Not destroyed',
        'TW-007': 'Not configured',
        'TW-008': 'Circular dependency',
        'TW-009': 'Metadata not found',
        'TW-010': 'Cannot Override',
        'TW-011': 'Not Valid',
        'TW-012': 'Error',
        'TW-013': 'Cannnot register',
        'TW-014': 'Core Constructor',
        'TW-015': 'Core Class Injection'
    }
};

export class Messages {
    static messages = MESSAGES;
    static language = 'en'
    static setLanguage(language: string): void {
        this.language = language;
    }
    private static get(name: string): string | number {
        const defaultMessages = this.messages.en;
        let languageMessages = this.messages[this.language];
        if (!languageMessages) {
            languageMessages = defaultMessages;
        }
        return (languageMessages[name]) ? languageMessages[name] : defaultMessages[name];
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
