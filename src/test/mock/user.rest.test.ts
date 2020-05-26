import { Observable, of } from 'rxjs';

import { Post, BodyParam, Inject, SecurityService, UnauthorizedException, Header, Claims, TokenClaims, Get, BadRequestException, Request, Response} from '../../main';
import { SignInModel } from './model/sign-in.model';
import { NotFoundException } from '../../main/core/exeption/not-found.exception';
import { InternalException } from '../../main/core/exeption/internal.exception';

export class UserRestTest {
    @Inject() securityService: SecurityService

    public users: Array<any> = [
        {
            id: 1,
            username: 'batman',
            name: 'Batman X',
            password: '1234567890',
            profiles: [0, 1]
        }
    ];

    @Post('/sign/in')
    public signIn(@BodyParam signIn: SignInModel): Observable<{token: string}> {
        const user = this.users.find((user: any) => user.username === signIn.username);
        if (!user || signIn.password != user.password) {
            throw new UnauthorizedException('Username or password incorrect.');
        }
        return of({token: this.securityService.generateToken({username: user.username, profiles: user.profiles})});
    }
    @Get('/user', true)
    public getUser(@Claims claims: TokenClaims): Observable<any> {
        const user = this.users.find((user: any) => user.username === claims.username);
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return of(user);
    }

    @Post('/user', true, [0, 5])
    public createUser(@BodyParam newUser: any): Observable<any> {
        const exists = this.users.find((user: any) => user.username === newUser.username);

        if (exists) {
            throw new BadRequestException('The username cannot be used.');
        }

        newUser.id = this.users.length + 1;
        this.users.push(newUser);
        return of(newUser);
    }
    @Get('/user/verify', true)
    public verifyToken(@Claims claims: TokenClaims, @Header headers: any): Observable<boolean> {
        const token = headers.authorization.replace('Bearer ', '');
        return of(token !== null && claims.username !== null);
    }
    @Get('/user/check')
    public check(@Request request: any, @Response response: any): Observable<boolean> {
        if (!request || !response) {
            throw new InternalException('Not injected the request and responsne');
        }
        return of(true);
    }
}