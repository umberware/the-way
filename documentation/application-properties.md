## Application Properties

The Application Core accepts a lot of properties for customization & configuration. In this section we will talk about these properties and what is their purpose.
You can check the default properties file [here](../src/main/resources/application.properties.yml).

### Behavior

By default, the CORE application will try to load an application.properties.yml in the root of the project. If hasen't an application file, the core will load the [default properties](../src/main/resources/application.properties.yml).
You can pass an argument in command line to pass a specific application.properties.yml path.
Also, you can pass properties in command line.
The application will **sum** the default properties, your application properties and the command line properties, priority:

    1. Command Line Properties
    2. The Properties File Passed
    3. The Default Properties

**Example: Passing a Properties Path In Command Line**

*In Development*

    ts-node src/main/main.ts --properties=/home/abc123/application.properties.yml

*In a Builded Version*

    node dist/src/main/main.js --properties=/home/abc123/application.properties.yml

**Example: Passing Property In Command Line**

    ts-node src/main/main.ts --the-way.server.https.enabled=true

    ts-node src/main/main.ts --mongo.ip=127.0.0.1 --mongo.port=27018

### Creating a Custom Properties for My Application

By default, all the properties that the application uses is inside the "the-way" and you can create properties for your application in annother application.properties section and access this properties with the Properties Handler.

**Example: The Application Properties With My Custom Properties Section**

*application.properties.yml*

    the-way:
    ...
    my-custom-section:
        jango: 1.23.3
        enabled: true
        ports:
            - 8989
            - 9292

*My Main*

    import { Application, TheWayApplication, Inject, PropertiesHandler, PropertyModel} from '@umberware/the-way';

    @Application()
    export class Main extends TheWayApplication {
        @Inject propertiesHandler: PropertiesHandler;

        public start(): void {
            console.log(this.propertiesHandler.getProperties('my-custom-section') as PropertyModel);
        }
    }


### Explaining the Properties and Their Purpose

#### 'the-way'

The TheWay section. In this section you will see all the properties that the framework uses.

### 'the-way.core'

This section represents the properties that the framework will use.

### 'the-way.core.scan'

Relative to the FileHandler(mechanism that import every TheWay component), has the follow properties:

 - path: Represents the path that will be scanned to find the components. *By default src/main*
 - full: When true the path must be the absolute path to the directory that will be scanned. In other case, will be used the process.cwb(). *By default false*
 - enabled: When true will use the others parameters to scan and find components. If false, you need to inject your classes into your main that extends TheWayApplication and is decorated with @Application(). *By default true*
 - includes: The extensions that must be scanned to find components(accepts Javascript Regex)
 - excludes: The directories, files or extensions that must be ignored(accepts Javascript Regex)

### 'the-way.core.log'

Relative to the Logger(An injectable service to log information) has the follow properties:

 - level: Can assume 0 or 1. When 0 will log debug and when 1 only errors and info. *By default 1*
 - date: Will log the date when logging. *By default true*

### 'the-way.core.language'

Represents the language that will be used in the Messages.getMessage. *By default en*

### 'the-way.core.process-exit'

When the initialization core has an error and this property is true, the node process will be terminated. *By default false*

### 'the-way.server'

Represents all the servers configurations in the application.

### 'the-way.server.enabled'

When these properties are true, we will start an express server using others properties present in this section. *By default true*

### 'the-way.server.operations-log'

When true, every REST call will be logged. *By default true*

### 'the-way.server.http'

Represents the http properties. These properties will be used to create a http server with express. Has the follow properties:

 - port: Is the port when the application will run. *By default 9000*
 - enabled: When true will start the Http Server. *By default true*

### 'the-way.server.https'

Represents the https properties. These properties will be used to create a https server with express. Has the follow properties:

- port: Is the port when the application will run. *By default 9001*
- enabled: When true will start the Https Server. *By default false*
- key-path: Is the certificate key path
- cert-path: Is the certificate path

### 'the-way.server.helmet.enabled'

Is an express middleware to increase the security of the server. *By default true*

### 'the-way.server.cors'

These properties are used to enable the cors. Has the follow properties:

 - enabled: Enable the Cors in the server. *By default true*
 - origin: Enable cross-origin over the server. *By default true*

### 'the-way.server.rest'

These properties are used to configure the REST operations of your application. Has the follow properties:

 - path: Is the root path of your REST operations. *By default /api*
 - security: Is a block of properties for the JWT authentication.
   - user-key: Is a key in for cypher the claims in the JWT token. This key is used in aes-256-cbc algorithm
   - token-key: Is the token key for the token validation
   - token-expiration: Is the token validation when created
 - swagger: Is a block of properties that allow the SwaggerUI for your REST operations
   - api-path: Is the Swagger path in application API. *By default /swagger*
   - enabled: When true will activate the SwaggerUI for your application. *By default false*
   - file: The swagger.json path properties
      - path: Is the path for a swagger.json. The swagger.json is used in the SwaggerUI. *By default swagger.json*
      - full: When true, the `the-way.server.rest.swagger.file.path` must be absolute. *By default false*

### 'the-way.server.file'

These properties are used to configure a file server. Has the follow properties:

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