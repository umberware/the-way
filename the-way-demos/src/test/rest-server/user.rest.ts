import { Inject, Post, BodyParam, Get, PathParam, Header, QueryParam, TokenClaims, SecurityService, Response, Request} from '@nihasoft/the-way'

import { Observable, of } from 'rxjs';

export class UserRest {
    @Inject() securityService: SecurityService;

    @Get('/api/user/:id', true, [0])
    public getUser(@PathParam('id') id: string,  @Header header, @Request req, @Response res, @TokenClaims tokenClaims): Observable<any> {
        console.log(tokenClaims)
        return of({
            username: 'Hanor',
            profiles: [0, 1],
            id: id
        });
    }
    @Get('/api/user/:id/tenants', true, [1])
    public getUserTenants(@PathParam('id') id: string, @QueryParam param: any, @TokenClaims user: any): Observable<Array<any>> {
        return of([{
            username: 'anakin',
            profiles: [3],
            id: 134
        },{
            username: 'Darth',
            profiles: [1],
            id: 669
        }]);
    }

    @Get('/api/token/user', true)
    public getUserToken(@TokenClaims user: any): Observable<any> {
        return of(user);
    }

    @Post('/api/sign/in')
    public signIn(@BodyParam signIn: any): Observable<any> {
        const user = {
            id: 1123,
            profiles: [0, 1, 2]
        };
        return of({
            user: user,
            token: this.securityService.generateToken({ username: user.id, profiles: user.profiles, requestorSystem: 'test'})
        });
    }
}