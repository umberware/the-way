## RestDecorators
This section is about the REST decorators and their purposes.
With these decorators you can map and provide security for a REST operations easily,
because the decorators abstracts the register in te server and provide mechanisms.

**When you decorate a class method with [@Get](#get), [@Delete](#delete), [@Head](#head), [@Patch](#patch),
[@Post](#post) or [@Put](#put), the method's return will be sent to the requester.
You can return: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [RxJs Observable](https://rxjs.dev/api/index/class/Observabl)
or a not "async" type like a custom JSON, string, integer and others**

### Summary

 - [@Get](#get)
 - [@Delete](#delete)
 - [@Head](#head)
 - [@Patch](#patch)
 - [@Post](#post)
 - [@Put](#put)
 - [@QueryParam](#queryparam)
 - [@PathParam](#pathparam)
 - [@BodyParam](#bodyparam)
 - [@Claims](#claims)
 - [@HeaderContext](#headercontext)
 - [@RequestContext](#requestcontext)
 - [@ResponseContext](#responsecontext)

### Get

The @Get is designed for [HTTP GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET).
You can use [@QueryParam](#queryparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

 - In Http/Https Get operations

Params:

 - *path*: is the endpoint that you will serve the operation
 - *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](documentation/the-way/core/service/core-security-service.md)
 - *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Delete

The @Delete is designed for [HTTP DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE).
You can use [@QueryParam](#queryparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Delete operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Head

The @Head is designed for [HTTP HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD).
You can use [@QueryParam](#queryparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Head operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Patch

The @Patch is designed for [HTTP PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH).
You can use [@BodyParam](#bodyparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Patch operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Post

The @Post is designed for [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST).
You can use [@BodyParam](#bodyparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Post operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Put

The @Put is designed for [HTTP PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT).
You can use [@BodyParam](#bodyparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Put operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](documentation/the-way/core/service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### QueryParam

The @QueryParam is designed to operations like [@Get](#get), [@Delete](#delete), [@Head](#head).
When you pass the @QueryParam as a parameter in a method that is mapped with [@Get](#get), [@Delete](#delete), [@Head](#head),
automatically this framework will inject the query param in this variable decorated with @QueryParam.

**Example**

    @Get('heroes')
    public getHeroesByPower(@QueryParam powerFilter: any): Observable<Array<SignModel>> {
       ...
    }

Where to use it:

- In a Method decorated with [@Get](#get), [@Delete](#delete) or [@Head](#head)

### PathParam

The @PathParam is designed to any operation mapped with rest decorators operations of this framework.
When you decorate a method variable in a rest mapped operation, the framework will inject the value into this variable.
It's important to know that the @PathParam variable must be the same in the mapped path without ':'.

**Will Work**

    @Get('heroes/:id')
    public getHeroesById(@PathParam('id') id: string): Observable<SignModel> {
       ...
    }


**Will NOT Work**

    @Get('heroes/:id')
    public getHeroesById(@PathParam('identifier') id: string): Observable<SignModel> {
       ...
    }

Where to use it:

 - Any mapped operation [@Get](#get), [@Delete](#delete), [@Head](#head), [@Put](#put), [@Post](#post) or [@Patch](#patch)

Params:

 - *name*: Is the mapped path variable without ':'.

### BodyParam

The @BodyParam is designed to operations like [@Put](#put), [@Post](#post), [@Patch](#patch).
When you pass the @BodyParam as a parameter in a method that is mapped with [@Put](#put), [@Post](#post) or [@Patch](#patch), automatically this framework will inject the request body in this variable decorated with @BodyParam.

**Example:**

    @Put('heroes/:id')
    public replaceHero(@BodyParam hero: SignModel): Observable<SignModel> {
        ...
    }

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post) or [@Patch](#patch)

### Claims

The @Claims is designed to any operation mapped with rest decorators operations of this framework.
With this decorator, you can inject JWT claims into an authenticated method.

**Example:**

    @Get('heroes', true)
    public getHeroes(@Claims claims: TokenClaims): Promise<Array<SignModel>> {
        ...
    }

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post), [@Patch](#patch),  [@Get](#get), [@Delete](#delete) or [@Head](#head)
- In authenticated PATH

### HeaderContext

The @HeaderContext is designed to any operation mapped with rest decorators operations of this framework.
This decorator can be used to inject the *request headers*, and to do it you must create a variable in the method signature and decorate that variable with this decorator.

**Example:**

    @Delete('heroes/:id')
    public deleteHero(@PathParam('id') heroId: string, @HeaderContext headers: any): void {
        ...
    }

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post), [@Patch](#patch),  [@Get](#get), [@Delete](#delete) or [@Head](#head)

### RequestContext

The @RequestContext is designed to any operation mapped with rest decorators operations of this framework.
You can inject in a method decorated with some REST Decorator, the *request object*. To do it, you need
to create a variable in the method and decorate that variable with this decorator.

**Example:**

    @Post('heroes')
    public createHero(@BodyParam hero: SignModel, @RequestContext request: any): void {
        ...
    }

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post), [@Patch](#patch),  [@Get](#get), [@Delete](#delete) or [@Head](#head)

### ResponseContext

The @ResponseContext is designed to any operation mapped with rest decorators operations of this framework.
In a method decorated with a REST Decorator, you can inject the *response object* and to do it you need
to create a variable in the method and decorate that variable with this decorator.

**Example:**

    @Post('heroes')
    public createHero(@BodyParam hero: SignModel, @ResponseContext request: any): void {
        ...
    }

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post), [@Patch](#patch),  [@Get](#get), [@Delete](#delete) or [@Head](#head)