## Application Properties

The Application Core accepts a lot of properties for customization & configuration. In this section we will talk about those properties and what is their purpose.
You can check the default properties file [here](src/main/resources/application.properties.yml).

### Summary

 - [Behavior](#behavior)
 - [Custom Properties In Application Properties](#custom-properties-in-application-properties)
 - [Mapped properties and their purposes](#mapped-properties-and-their-purposes)
    - [the-way](#the-way)
    - [the-way.core](#the-waycore)
    - [the-way.core.scan](#the-waycorescan)
    - [the-way.core.log](#the-waycorelog)
    - [the-way.core.language](#the-waycorelanguage)
    - [the-way.core.process-exit](#the-waycoreprocess-exit)
    - [the-way.server](#the-wayserver)
    - [the-way.server.enabled](#the-wayserverenabled)
    - [the-way.server.operations-log](#the-wayserveroperations-log)
    - [the-way.server.http](#the-wayserverhttp)
    - [the-way.server.https](#the-wayserverhttps)
    - [the-way.server.helmet](#the-wayserverhelmetenabled)
    - [the-way.server.cors](#the-wayservercors)
    - [the-way.server.rest](#the-wayserverrest)
    - [the-way.server.file](#the-wayserverfile)

### Behavior

By default, the CORE application will try to load an application.properties.yml in the root of the project. If hasn't an application file, the core will load the [default properties](src/main/resources/application.properties.yml).
You can pass an argument in command line to pass a specific application.properties.yml path.
Also, you can pass properties in command line.
The application will **sum** the default properties, your application properties and the command line properties, priority:

    1. Command Line Properties
    2. The Properties File Passed
    3. The Default Properties

**Example: Passing a Properties File Path Argument In Command Line**

*In Development*

    ts-node src/main/main.ts --properties=/home/abc123/application.properties.yml

*In a Built Version*

    node dist/src/main/main.js --properties=/home/abc123/application.properties.yml

**Example: Passing Property In Command Line**

    ts-node src/main/main.ts --the-way.server.https.enabled=true

    node dist/src/main/main.js src/main/main.ts --mongo.ip=127.0.0.1 --mongo.port=27018

### Custom Properties In Application Properties
By default, all properties the application uses are within the "the-way", and
you can create properties for your application in the another application.properties section and
access those properties with the property manager.

**Example: The Application Properties With My Custom Properties Section And Accessing those Properties**

*File: application.properties.yml*

    the-way:
    ...
    my-custom-section:
        jango: 1.23.3
        enabled: true
        ports:
            - 8989
            - 9292

*Class: My Main*

    import { Application, TheWayApplication, Inject, PropertiesHandler, PropertyModel} from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject propertiesHandler: PropertiesHandler;

        public start(): void {
            console.log(this.propertiesHandler.getProperties('my-custom-section') as PropertyModel);
        }
    }

### Mapped Properties and Their Purposes

#### 'the-way'

The TheWay section. In this section you will see all the properties that the framework uses.

### the-way.core

This section represents the properties that the framework will use.

### the-way.core.scan

Relative to the [FileHandler](documentation/the-way/core/handler/file-handler.md)(mechanism that import every TheWay component), has the follow properties:

 - path: Represents the path that will be scanned to find the components.
   In a built code, if the property full is false, the path will be contextualized with the *process.cwb()* to get the "output directory". *By default src/main*
 - full: When true, the path property must be an absolute path to the directory that will be scanned. In other case, will be used the process.cwb(). *By default false*
 - enabled: When true, will use the others parameters to scan and find components. If it's false, you need to inject your classes into your main class which extends TheWayApplication and is decorated with [@Application](documentation/the-way/core/decorator/core-decorators.md#application). *By default true*
 - includes: The extensions that must be scanned to find components(accepts Javascript Regex)
 - excludes: The directories, files or extensions that must be ignored(accepts Javascript Regex)

**These properties will change when is created the [TheWayCli](https://github.com/umberware/the-way/issues/47)**

### the-way.core.log

Relative to the Logger(An injectable service to log information) has the follow properties:

 - level: Can assume 0 or 1. When 0 will log debug and when 1 only errors and info. *By default 1*
 - date: Will log the date when logging. *By default true*

See the logger documentation [here](service/core-logger.md)

### the-way.core.language

Represents the language that will be used in the Messages.getMessage. *By default en*.
You can check how to customize and enable another language [here](service/core-message-service.md);

### the-way.core.process-exit

When an error occurs at the core boot or is called the [destroy](core.md#method-static-destroy) method from core and this property is true, the node process will be terminated. *By default, false*

### the-way.server

Represents all the servers configurations in the application. See [Server Configuration](configuration/server-configuration.md) documentation.

### the-way.server.enabled

When those properties are true, we will start an express server using others properties present in this section. *By default true*

### the-way.server.operations-log

When true, every REST call will be logged. *By default true*

### the-way.server.http

Represents the http properties. those properties will be used to create a http server with express. Has the follow properties:

 - port: Is the port when the application will run. *By default 9000*
 - enabled: When true will start the Http Server. *By default true*

### the-way.server.https

Represents the https properties. those properties will be used to create a https server with express. Has the follow properties:

- port: Is the port when the application will run. *By default 9001*
- enabled: When true will start the Https Server. *By default false*
- key-path: Is the certificate key path
- cert-path: Is the certificate path

### the-way.server.helmet.enabled

Is an express middleware to increase the security of the server. *By default true*

### the-way.server.cors

those properties are used to enable the cors. Has the follow properties:

 - enabled: Enable the Cors in the server. *By default true*
 - origin: Enable cross-origin over the server. *By default true*

### the-way.server.rest

those properties are used to configure the REST operations of your application. Has the follow properties:

 - path: Is the root path of your REST operations. *By default /api*
 - security: Is a block of properties for the JWT authentication.
   - user-key: Is the key used to cipher claims in the JWT token. This key is used in aes-256-cbc algorithm
   - token-key: Is the token key for token validation
   - token-expiration: Is the token validation when created
 - swagger: Is a block of properties that allow the SwaggerUI for your REST operations
   - api-path: Is the Swagger path in application API. *By default /swagger*
   - enabled: When true will activate the SwaggerUI for your application. *By default false*
   - file: The swagger.json path properties
      - path: Is the path for a swagger.json. The swagger.json is used in the SwaggerUI. *By default swagger.json*
      - full: When true, the `the-way.server.rest.swagger.file.path` must be absolute. *By default false*

You can check for more information in [CoreCryptoService](service/core-crypto-service-doc.md), [ServerConfiguration](configuration/server-configuration.md) and
[CoreRestService](service/core-rest-service.md)

### the-way.server.file

those properties are used to configure a file server. Has the follow properties:

 - enabled: Will initialize the file server when true. *By default false*
 - path: Is the base path for your files that will be served in the server. *By default ''*
 - full: When true, the path must be absolute. *By default false*
 - fallback: When true, if the request path is not for the API, will be sent the index.html. *By default false*
 - static: Is a route /static mapped for the file path
    - path: Is the file path for the static files. *By default ''*
    - enabled: When true, if a request path contains /static will be sent the requested file in the mapped file path. *By default false*
    - full: When true, the `the-way.server.file.static.path` must be absolute. When false, the `the-way.server.file.path` will added in the `the-way.server.file.static.path`. *By default false*
 - assets: Is a route /assets mapped for the file path
   - path: Is the file path for the assets files. *By default ''*
   - enabled: When true, if a request path contains /assets will be sent the requested file in the mapped file path. *By default false*
   - full: When true, the `the-way.server.file.assets.path` must be absolute. When false, the `the-way.assets.file.path` will added in the `the-way.server.file.static.path`. *By default false*