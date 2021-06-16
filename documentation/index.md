## The Way Documentation

This paper will relate all the library components with their documentation and function, and some Guides to teach how to work with TheWay.

### Summary

 - [Guides](#guides)
 - [Classes and Components Documentation](#classes-and-components-documentation)

### Guides

You can check all the code present in the guides in [The Way Examples Repository](https://github.com/umberware/the-way-examples)

- [NodeJs With Typescript](guides/node-typescript-guide.md)
- [TheWay: HeroesRest](guides/the-way-heroes-rest.md)
- [TheWay: Internationalization](guides/the-way-internationalization.md)

### Classes and Components Documentation

 - [Application Properties](the-way/core/application-properties.md)
 - [Core](the-way/core/core.md)
 - [TheWayApplication](the-way/core/the-way-application.md)
 - Abstract
    - [Destroyable](the-way/core/shared/abstract/destroyable.md)
    - [Configurable](the-way/core/shared/abstract/configurable.md)
 - Constant
    - [CORE_MESSAGES](the-way/core/shared/constant/core-messages-constant.md)
 - Configuration
    - [ServerConfiguration](the-way/core/configuration/server-configuration.md)
 - Decorators
    - [CoreDecorators](the-way/core/decorator/core-decorators.md)
    - [RestDecorators](the-way/core/decorator/rest-decorators.md)
 - Enum
    - [ClassTypeEnum](the-way/core/shared/enum/class-type-enum.md)
    - [CoreStateEnum](the-way/core/shared/enum/core-state-enum.md)
    - [HttpCodeEnum](the-way/core/shared/enum/http-code-enum.md)
    - [HttpTypeEnum](the-way/core/shared/enum/http-type-enum.md)
    - [LogLevelEnum](the-way/core/shared/enum/log-level-enum.md)
 - Exception
    - [ApplicationException](the-way/core/exception/application-exception.md)
    - [RestException](the-way/core/exception/rest-exception.md)
    - [BadRequestException](the-way/core/exception/bad-request-exception.md)
    - [InternalException](the-way/core/exception/internal-exception.md)
    - [NotAllowedException](the-way/core/exception/not-allowed-exception.md)
    - [NotFoundException](the-way/core/exception/not-found-exception.md)
    - [UnauthorizedException](the-way/core/exception/unauthorized.exception.md)
 - Handlers
    - [DependencyHandler](the-way/core/handler/dependency-handler.md)
    - [FileHandler](the-way/core/handler/file-handler.md)
    - [InstanceHandler](the-way/core/handler/instance-handler.md)
    - [PropertiesHandler](the-way/core/handler/properties-handler.md)
    - [RegisterHandler](the-way/core/handler/register-handler.md)
 - Model
    - [ConstructorModel](the-way/core/shared/model/constructor-model.md)
    - [ConstructorMapModel](the-way/core/shared/model/constructor-map-model.md)
    - [DependencyModel](the-way/core/shared/model/dependency-model.md)
    - [DependencyMapModel](the-way/core/shared/model/dependency-map-model.md)
    - [DependencyTreeModel](the-way/core/shared/model/dependency-tree-model.md)
    - [InstancesMapModel](the-way/core/shared/model/instances-map-model.md)
    - [OverriddenMapModel](the-way/core/shared/model/overridden-map-model.md)
    - [PathModel](the-way/core/shared/model/path-model.md)
    - [PathMapModel](the-way/core/shared/model/path-map-model.md)
    - [PropertyModel](the-way/core/shared/model/property-model.md)
    - [TokenClaimsModel](the-way/core/shared/model/token-claims-model.md)
 - Service
    - [CoreCryptoService](the-way/core/service/core-crypto-service-doc.md)
    - [CoreLogger](the-way/core/service/core-logger.md)
    - [CoreMessageService](the-way/core/service/core-message-service.md)