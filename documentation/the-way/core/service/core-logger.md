[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/service/core-logger.ts)

## CoreLogger

This class is used to log information. Some behaviors can be changed with the [the-way.core.log](documentation/the-way/core/application-properties.md#the-waycorelog) properties

### Summary

 - [Method: debug](#method-debug)
 - [Method: error](#method-error)
 - [Method: getLogLevel](#method-getloglevel)
 - [Method: info](#method-info)
 - [Method: setProperties](#method-setproperties)
 - [Method: warn](#method-warn)

### Method: debug

This method will log information as "debug" type
When the [loglevel](documentation/the-way/core/shared/enum/log-level-enum.md) is not Full, the "debug" logs will not be displayed

Params:

 - *message*: is the message to show
 - *prefix*: if not provided, the message will be prefixed with '[DEBUG]'

### Method: error

This method will log information as Error type

Params:

- *error*: is the error to be logged. Can be an instance of [ApplicationException](documentation/the-way/core/exception/application-exception.md) or an Error
- *prefix*: if not provided, the message will be prefixed with '[ERROR]'
- *message*: if want to log a message with the error, you can use this parameter

### Method: getLogLevel

Retrieves the actual [log level](documentation/the-way/core/shared/enum/log-level-enum.md)

Return:

 - The actual [log level](documentation/the-way/core/shared/enum/log-level-enum.md)

### Method: info

This method will log information as Info type

Params:

- *message*: is the message to be logged
- *prefix*: if not provided, the message will be prefixed with '[INFO]'

### Method: setProperties

This method will set the local [the-way.core.log](documentation/the-way/core/application-properties.md#the-waycorelog) properties.

Params:

- *properties*: is a [PropertyModel](documentation/the-way/core/shared/model/property-model.md) object to be defined as [the-way.core.log](documentation/the-way/core/application-properties.md#the-waycorelog) properties

### Method: warn

This method will log information as Warn type

Params:

- *message*: is the message to be logged
- *prefix*: if not provided, the message will be prefixed with '[WARN]'