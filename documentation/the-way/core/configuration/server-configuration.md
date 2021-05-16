## ServerConfiguration

The ServerConfiguration is responsible to start the http/https server with some features.

Features:

  - Http Server
  - Https Server
  - File Server
  - Swagger UI
  - Middlewares for [express](https://github.com/expressjs/express) routes, security and others

With [@Configuration](../decorator/core-decorators.md#configuration) you can override this class and provide YOUR ServerConfiguration class.

### Summary

 - [Initialization: Features](#initialization-features)
 - [Method: configure](#method-configure)
 - [Method: destroy](#method-destroy)
 - [Method: registerPath](#method-registerpath)
 - [Method: registerMiddleware](#method-registermiddleware)

### Initialization: Features

All properties listed in this library can be customized and this section will explain how to enable some server features with these properties, and their purposes
It's important to know that all the registered REST operations (when the server is enabled) will have the `the-way.server.rest.path` at the beginning.
You can check the full documentation of the properties [here](../application-properties.md).

#### Enabling: Http

To enable the http, you need to provide the value true in the properties:

`the-way.server.enabled`

`the-way.server.http.enable`

You can customize the port to the http server with the property `the-way.server.http.port`.

#### Enabling: Https

To enable the https, you need to provide the value true in the properties:

`the-way.server.enabled`

`the-way.server.https.enable`

Also, you need to provide the certificate path and certificate key path with the properties:

  `the-way.server.https.key-path` Is the certificate key path

  `the-way.server.https.cert-path` Is the certificate path


You can customize the port to the https server with the property `the-way.server.https.port`.

#### Enabling: Swagger

We use the [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) to provide an interface that can be used to check the REST operations documentation and test it.
To use it you must provide:

 - `the-way.server.swagger.enabled` to enable the swagger ui
 - `the-way.server.swagger.file` to tell us where are the `swagger.json` file
 - `the-way.server.swagger.api-path` to register where in the REST paths the swagger ui can be accessed

#### Enabling: File Server

You can serve files with this server configuration, but for that you need to specify some properties that will be described below:

 - `the-way.server.file.enabled` must be true
 - `the-way.server.file.path` is the path to the directory that contains the files to be served
 - `the-way.server.file.full` when this property is true, we will assume the value of the property file.path as absolute path and not relative.
 - `the-way.server.file.fallback` this property allows the system to redirect to the index.html when the wanted URL is not a REST operation, Static path or assets path. It's can be used when you serve an interface application that has inner routes.
 - `the-way.server.file.static` it's a group of properties to describe paths to static files
    - `the-way.server.file.static.enabled` when true, all requests that contains at the begging static/ will bind with the directory of static files
    - `the-way.server.file.static.path` is the directory of the static files
    - `the-way.server.file.static.full` when this property is true, we will assume the value of the property static.path as absolute path and not relative.
- `the-way.server.file.assets` it's a group of properties to describe paths to assets files
    - `the-way.server.file.assets.enabled` when true, all url requests that contains at the begging assets/ will bind with the directory of assets files
    - `the-way.server.file.assets.path` is the directory of the assets files
    - `the-way.server.file.assets.full` when this property is true, we will assume the value of the property assets.path as absolute path and not relative.

#### Enabling: Helmet

[Helmet](https://www.npmjs.com/package/helmet) is an express middleware that improve the security of a server and by default is enabled.
If you want to disable this middleware you can do this with the property `the-way.server.helmet.enabled`.

#### Enabling: Operations Log

All the operations requested will be logged. By default, is enabled. You can change this with the property:

`the-way.server.operations-log`

#### Enabling: Cors

By default, is enabled the cors. You can disable the cors with the properties:

`the-way.server.cors.enabled`

`the-way.server.cors.origin`

### Method: configure

This method is called when the class is built and will configure and start the server.

### Method: destroy

Will be called when the Core change to [DESTRUCTION_STARTED](../core.md#step-destruction) step and will kill the server.

### Method: registerPath

This method will register any REST path in the server and enable.

### Method: registerMiddleware

With this method you can enable some middlewares(for express) in the server, like body parser, helmet and others.
