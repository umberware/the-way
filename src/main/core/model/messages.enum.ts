export enum MessagesEnum {
    'no-http-service' = 'If you want to use the HttpService and the rest decorators, you should pass HttpService or and extended class of HttpService on Application decorator HttpService not found',
    'not-found' = 'Not Found',
    'bad-request' = 'Bad Request',
    'internal-server-error' = 'Internal server error',
    'internal-error' = 'Internal error',
    'not-authorized' = 'Not authorized',
    'not-allowed' = 'Not Allowed',
    'building-core-instances' = 'Building core instancies tree...',
    'building-properties' = 'Building properties',
    'building-tree-instances' = 'Building dependencies tree...',
    'building-instances' = 'Building instances...',
    'building-custom-instances' = 'Building custom instances...',
    'building-instance-error' = 'Error Building Instance',
    'injecting' = 'Injecting:\n   Target: ',
    'injectable' = '\n   Injectable: ',
    'injectable-found' = '\n   Found: ',
    'building-http-service' = 'Building HttpService',
    'destroy-all' = 'I\'m Inevitable, destroying...',
    'time-has-come-one' = 'One Man Army. Nice to meet too you, my time has come :(.',
    'not-destroyed' = 'Is not destoyed.',
    'time-has-come-army' = 'Fire in the hole! Nice to meet too you, my time has come :(.',
    'let-me-go' = 'Please, let me go. Error on self destruction.',
    'configuration-done' = 'All configurations are done.',
    'ready' = 'The application is fully loaded.',
    'not-configured' = 'Is not configured.',
    'properties-not-found' = 'Properties file not found. Will be used the default.',
    'properties-wrong-format' = 'Error on processing the properties file',
    'server-couldnt-initialize' = 'Couldn\'t initialize at the port: ',
    'server-port-in-use' = 'Cannot initialize: Port in Use',
    'not-the-way' = 'Your @Application class must extends the TheWayApplication',
    'rest-parameters-are-differents' = 'The path variable and the method argument name are differents.',
    'rest-claims-without-token-verify' = 'To inject the @Claims you must declare an authenticated path.',
    'rest-without-authentication' = 'Path not authenticated',
    'rest-empty-request' = 'Request is empty',
    'rest-cannot-perform' = 'You cannot perform that.',
    'rest-no-token' = 'You doesn\'t provided a token',
    'rest-invalid-token' = 'The provided token is invalid.',
    'application-multiples' = 'The core are called more than one time.'
}
