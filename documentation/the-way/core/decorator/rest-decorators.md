## RestDecorators
This section is about the REST decorators and their purposes. With these decorators you can map and provide security for a REST operations easily, because the decorators abstracts the register in te server.

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

The @Get is designed for [HTTP GET](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/GET) With this decorator you can map a path with security or not.
You can use [@QueryParam](#queryparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

 - In Http/Https Get operations

Params:

 - *path*: is the endpoint that you will serve the operation
 - *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](../service/core-security-service.md)
 - *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Delete

The @Delete is designed for [HTTP DELETE](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/DELETE).
With this decorator you can map a path with security or not.
You can use [@QueryParam](#queryparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Delete operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](../service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Head

The @Head is designed for [HTTP HEAD](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/HEAD).
With this decorator you can map a path with security or not.
You can use [@QueryParam](#queryparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Head operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](../service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Patch

The @Patch is designed for [HTTP PATCH](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/PATCH).
With this decorator you can map a path with security or not.
You can use [@BodyParam](#bodyparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Patch operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](../service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Post

The @Post is designed for [HTTP POST](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/POST).
With this decorator you can map a path with security or not.
You can use [@BodyParam](#bodyparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Post operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](../service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### Put

The @Put is designed for [HTTP PUT](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/PUT).
With this decorator you can map a path with security or not.
You can use [@BodyParam](#bodyparam), [@PathParam](#pathparam) and others that is for all operations type.

Where to use it:

- In Http/Https Put operations

Params:

- *path*: is the endpoint that you will serve the operation
- *authenticated*: when true, the user must be logged in and pass a valid token in the header. See [CoreSecurityService](../service/core-security-service.md) documentation
- *allowedProfiles*: when the path must be authenticated, you can pass an array of profiles. The user owner of the token must have one of the profiles to be allowed to use.

### QueryParam

The @QueryParam is designed to operations like [@Get](#get), [@Delete](#delete), [@Head](#head).
When you pass the @QueryParam as a parameter in a method that is mapped with [@Get](#get), [@Delete](#delete), [@Head](#head),
automatically this framework will inject the query param in this variable decorated with @QueryParam.

Where to use it:

- In a Method decorated with [@Get](#get), [@Delete](#delete) or [@Head](#head)

### PathParam

The @PathParam is designed to any operation mapped with rest decorators operations of this framework.
When you decorate a method variable in a rest mapped operation, the framework will inject the value into this variable.
It's important to know that the @PathParam variable must be the same in the mapped path without ':'.

**Will Work**

    @Get('heroes/:id')
    public getHeroesById(@PathParam('id') id: string): Observable<Hero> {
       ...
    }


**Will NOT Work**

    @Get('heroes/:id')
    public getHeroesById(@PathParam('identifier') id: string): Observable<Hero> {
       ...
    }

Where to use it:

 - Any mapped operation [@Get](#get), [@Delete](#delete), [@Head](#head), [@Put](#put), [@Post](#post) or [@Patch](#patch)

Params:

 - *name*: Is the mapped path variable without ':'.

### BodyParam

The @BodyParam is designed to operations like [@Put](#put), [@Post](#post), [@Patch](#patch).
When you pass the @BodyParam as a parameter in a method that is mapped with [@Put](#put), [@Post](#post) or [@Patch](#patch), automatically this framework will inject the request body in this variable decorated with @BodyParam.

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post) or [@Patch](#patch)

### Claims

The @Claims is designed to any operation mapped with rest decorators operations of this framework.
The mapped path must be authenticated. The objective of this decorator is inject into the method in a variable decorated with this decorator, the claims of a JWT token.

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post), [@Patch](#patch),  [@Get](#get), [@Delete](#delete) or [@Head](#head)

### HeaderContext

The @HeaderContext is designed to any operation mapped with rest decorators operations of this framework.
The objective of this decorator is inject into the method in a variable decorated with this decorator, the request headers.

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post), [@Patch](#patch),  [@Get](#get), [@Delete](#delete) or [@Head](#head)

### RequestContext

The @RequestContext is designed to any operation mapped with rest decorators operations of this framework.
The objective of this decorator is inject into the method in a variable decorated with this decorator, the actual express request.

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post), [@Patch](#patch),  [@Get](#get), [@Delete](#delete) or [@Head](#head)

### ResponseContext

The @ResponseContext is designed to any operation mapped with rest decorators operations of this framework.
The objective of this decorator is inject into the method in a variable decorated with this decorator, the actual express response.

Where to use it:

- In a Method decorated with [@Put](#put), [@Post](#post), [@Patch](#patch),  [@Get](#get), [@Delete](#delete) or [@Head](#head)