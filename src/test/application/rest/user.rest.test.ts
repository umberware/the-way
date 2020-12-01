import { NotFoundException, InternalException, Post, BodyParam, Inject,
    SecurityService, UnauthorizedException, Header, Claims, TokenClaims, Get,
    BadRequestException, Request, Response, LogService, LogLevel
} from '../../../main';

import { Observable, of } from 'rxjs';

import { SignInModel } from './model/sign-in.model';
import { CryptoService } from '../../../main/core/service/crypto.service';

export class UserRestTest {
    @Inject() securityService: SecurityService
    @Inject() cryptoService: CryptoService;
    @Inject() logService: LogService;

    constructor() {
        this.users.push({
            id: 1,
            username: 'batman',
            name: 'Batman X',
            password: this.cryptoService.hash('1234567890', 'sha512'),
            hash: this.cryptoService.hash(this.cryptoService.randomHash(80), 'sha512', 'base64'),
            profiles: [0, 1]
        })
        this.logService.setLogLevel(LogLevel.FULL);
    }

    public users: Array<any> = [];

    @Post('/sign/in')
    public signIn(@BodyParam signIn: SignInModel): Observable<{token: string}> {
        this.logService.info('Trying to sign in for username: ' + signIn.username);
        const user = this.users.find((user: any) => user.username === signIn.username);
        const password = this.cryptoService.hash(signIn.password, 'sha512');
        if (!user || password != user.password) {
            const exception = new UnauthorizedException('Username or password incorrect.');
            this.logService.error(exception)
            throw exception;
        }
        this.logService.info('Sign in executed with success.');
        return of({token: this.securityService.generateToken({username: user.username, profiles: user.profiles})});
    }
    @Get('/user', true)
    public getUser(@Claims claims: TokenClaims): Observable<any> {
        this.logService.info('Getting the user from token.')
        const user = this.users.find((user: any) => user.username === claims.username);
        if (!user) {
            const exception = new NotFoundException('User not found.');
            this.logService.error(exception)
            throw exception;
        }
        this.logService.debug('The user from token is: ' + user.username);
        return of(user);
    }

    @Post('/user', true, [0, 5])
    public createUser(@BodyParam newUser: any): Observable<any> {
        this.logService.info('Creating the user: ' + newUser.username);
        const exists = this.users.find((user: any) => user.username === newUser.username);
        newUser.password = this.cryptoService.hash(newUser.password, 'sha512');
        newUser.hash = this.cryptoService.hash(this.cryptoService.randomHash(80), 'sha512', 'base64');

        if (exists) {
            //Testing the log service
            const exception = new Error('The username cannot be used');
            this.logService.error(exception)
            throw new BadRequestException('The username cannot be used');
        }

        newUser.id = this.users.length + 1;
        this.users.push(newUser);
        this.logService.info('User has been created.')
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
            throw new InternalException('Not injected the request and response');
        }
        response.send(true)
        return of(true);
    }
    @Get('/user/test-internal-exception')
    public testInternalException(): Observable<boolean> {
        throw new InternalException('internal-server-worker');
    }
    @Get('/user/claims/null', true, ['death-star-master'])
    public nullClaims(@Claims claims: TokenClaims): Observable<boolean> {
        return of(!claims);
    }
    @Post('/user/claims/sign/in/null')
    public claimSignInNull(@BodyParam signIn: SignInModel): Observable<{token: string}> {
        this.logService.info('Trying to sign in for username: ' + signIn.username);
        const user = this.users.find((user: any) => user.username === signIn.username);
        const password = this.cryptoService.hash(signIn.password, 'sha512');
        if (!user || password != user.password) {
            const exception = new UnauthorizedException('Username or password incorrect.');
            this.logService.error(exception)
            throw exception;
        }
        this.logService.info('Sign in executed with success.');
        return of({token: this.securityService.generateToken(null)});
    }
}