[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/service/core-message.service.ts)

## CoreMessageService

This service is used to get and prepare messages to be logged or retrieved to a final user.
The messages that will be used are defined in the object [CORE_MESSAGES](documentation/the-way/core/shared/constant/core-messages-constant.md) and the default language is English(en)

**You can check the guide [The Way Internationalization](documentation/guides/the-way-internationalization.md) to see how to use the internationalization in TheWay Framework**

### Summary

 - [Property: static messages](#property-static-messages)
 - [Property: static language](#property-static-language)
 - [Method: static setLanguage](#method-static-setlanguage)
 - [Method: static getCodeMessage](#method-static-getcodemessage)
 - [Method: static getMessage](#method-static-getmessage)

### Property: static messages

Is a local reference to [CORE_MESSAGES](documentation/the-way/core/shared/constant/core-messages-constant.md)

### Property: static language

Is the language that will be used to find the message in [CORE_MESSAGES](documentation/the-way/core/shared/constant/core-messages-constant.md). The default value is 'en'

### Method: static setLanguage

This method will set the language that will be used to find the message in [CORE_MESSAGES](documentation/the-way/core/shared/constant/core-messages-constant.md)
*if the language is not found in the CORE_MESSAGES object, will be used the default language to find the message*

Params:

 - *language*: Is the language

### Method: static getCodeMessage

This method can be used to retrieve a message that is a number

Params:

 - *name*: The message in the CoreMessage

Return:

 - The message number

### Method: static getMessage

This method retrieves a message. Also, this method replaces
every $ in the message with a provided value. If the current
language does not have the message, the method will try to get
the message using the default language (en)

Params:

- *name*: The message in the CoreMessage
- *replacements*: This array of string will be used to replace every $ in the message with a value in the array. The replacements will use the array order

Return:

- The handled message