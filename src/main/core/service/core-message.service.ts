import { CORE_MESSAGES } from '../shared/constant/core-messages.constant';

/**
 * @class CoreMessageService
 * @description This service is used to get and prepare messages to be
 *  logged or retrieved to a final user. The messages that will be used
 *  are defined in the object CORE_MESSAGES
 * @since 1.0.0
 * */
export class CoreMessageService {
    /**
     * @property messages
     * @description Is a local reference to CORE_MESSAGES
     * @since 1.0.0
     * */
    public static messages = CORE_MESSAGES;
    /**
     * @property language
     * @description Is the language that will be used to find the message in
     *  CORE_MESSAGES
     * @since 1.0.0
     * */
    public static language = 'en'
    /**
     * @property setLanguage
     * @description This method will set the language that will be used to
     *  find the message in CORE_MESSAGES
     * @param language is the language
     * @since 1.0.0
     * */
    public static setLanguage(language: string): void {
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
    /**
     * @property getCodeMessage
     * @description This method can be used to retrieve a message that is a number
     * @param name The name of the message in CoreMessage
     * @return The message number
     * @since 1.0.0
     * */
    public static getCodeMessage(name: string): number {
        return this.get(name) as number;
    }
    /**
     * @property getMessage
     * @description This method retrieves a message. Also, this method replaces
     *  every $ in the message with a provided value. If the current language
     *  does not have the message, the method will try to get the message
     *  using the default language (en)
     * @param name The name of the message in CoreMessage
     * @param replacements This array of string will be used to replace every $ in the message with a value in the array.
     *  The replacements will use the array order
     * @return The handled message
     * @since 1.0.0
     * */
    public static getMessage(name: string, replacements?: Array<string>): string {
        let message = this.get(name) as string;

        if (replacements && (typeof message === 'string')) {
            for (const replace of replacements) {
                message = (message as string).replace('$', replace);
            }
        }

        return message;
    }
}
