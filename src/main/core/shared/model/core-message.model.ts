/**
 *   @name CoreMessageModel
 *   @description This interface represents the "dictionary" of a language and is used in the CORE_MESSAGES
 *   @property Generic [key: string] Is a generic field, and the key is the language.
 *      The value of this field is another generic field
 *      where the key is the message name and the value is the message/code
 *   @since 1.0.0
 */
export interface CoreMessageModel  {
    [key: string]: {
        [key: string]: string | number;
    };
}
