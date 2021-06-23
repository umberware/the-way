[![Source Code](https://img.shields.io/badge/Source%20Code-black?logo=TypeScript&style=for-the-badge)](src/main/core/handler/properties.handler.ts)

## PropertiesHandler

PropertiesHandler is responsible to handle the application properties.
The properties can be passed in command line and .yml file. The PropertiesHandler will "SUM"
the given properties with the [Default Properties](documentation/the-way/core/application-properties.md).
Properties passed in command line is stronger than properties in a file.

### Summary

  - [Method: getProperties](#method-getproperties)

### Method: getProperties

This method receives an "propertyName" and return the property when is present.
Will return null if the property is not found. You can pass the full key to get the property.
**You can [@Inject](documentation/the-way/core/decorator/core-decorators.md) the PropertiesHandler or get the instance at
run time with [Core.getInstanceByName](documentation/the-way/core/core.md#method-static-getinstancebyname)**

Params:

 - *propertyName*: With type string, can be the full object key

Return:
 - The return can be string, boolean, number, null or PropertyModel

**Example:**

    const propertiesHandler = Core.getInstanceByName<PropertiesHandler>('PropertiesHandler');
    const httpsProperties: PropertyModel = propertiesHandler.getProperties('the-way.server.https')