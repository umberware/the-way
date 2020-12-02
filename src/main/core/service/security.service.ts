import * as Jwt from 'jsonwebtoken';

import { Observable, of } from 'rxjs';

import { UnauthorizedException } from '../exeption/unauthorized.exception';
import { NotAllowedException } from '../exeption/not-allowed.exception';
import { ApplicationException } from '../exeption/application.exception';
import { CORE } from '../core';
import { CryptoService } from './crypto.service';
import { PropertiesConfiguration } from '../configuration/properties.configuration';
import { TokenClaims } from '../model/token-claims.model';
import { MessagesEnum } from '../model/messages.enum';
import { Service } from '../decorator/service.decorator';

/*eslint-disable @typescript-eslint/no-explicit-any*/
@Service()
export class SecurityService {

    protected propertiesConfiguration: PropertiesConfiguration;

    constructor() {
        const core = CORE.getCoreInstance();
        this.propertiesConfiguration = core.getInstanceByName<PropertiesConfiguration>('PropertiesConfiguration');
    }

    public generateToken(tokenClaims: TokenClaims | null): string {
        const cryptedClaims: string | null = this.generateTokenClaims(tokenClaims);
        return Jwt.sign({ data: cryptedClaims }, this.getTokenKey(), { expiresIn: this.getTokenExpiration() });
    }
    protected generateTokenClaims(tokenClaims: TokenClaims | null): string | null {
        if (!tokenClaims) {
            return null;
        }
        const cryptoService = CORE.getCoreInstance().getInstanceByName('CryptoService') as CryptoService;
        return cryptoService.cipherIv(JSON.stringify(tokenClaims), 'aes-256-cbc', this.getUserKey());
    }
    public getTokenClaims(token: string): TokenClaims | undefined {
        const cryptoService = CORE.getCoreInstance().getInstanceByName('CryptoService') as CryptoService;
        const claims = Jwt.verify(token, this.getTokenKey()) as {data: string};

        if (claims.data) {
            return JSON.parse(cryptoService.decipherIv(claims.data, 'aes-256-cbc', this.getUserKey()));
        } else {
            return undefined;
        }
    }
    protected getUserKey(): string {
        const theWayProperties = this.propertiesConfiguration.properties['the-way'];
        const restProperties = theWayProperties['server']['rest'];
        return restProperties.security['user-key'] as string;
    }
    protected getTokenKey(): string {
        const theWayProperties = this.propertiesConfiguration.properties['the-way'];
        const restProperties = theWayProperties['server']['rest'];
        return restProperties.security['token-key'] as string;
    }
    protected getTokenExpiration(): string {
        const theWayProperties = this.propertiesConfiguration.properties['the-way'];
        const restProperties = theWayProperties['server']['rest'];
        return restProperties.security['token-expiration'] as string;
    }
    protected verifyProfile(token: TokenClaims | undefined, profiles: Array<any>): void{
        if (!token || !token.profiles || !(token.profiles instanceof Array)) {
            throw new NotAllowedException(MessagesEnum['rest-cannot-perform']);
        }

        const tokenProfiles: Array<any> = token.profiles;
        for (const profile of profiles) {
            if (tokenProfiles.includes(profile)) {
                return;
            }
        }

        throw new NotAllowedException(MessagesEnum['rest-cannot-perform']);
    }
    public verifyToken(
        token: string, profiles: Array<any> | undefined,
        authenticated: boolean | undefined
    ): Observable<TokenClaims | undefined> {
        if (!authenticated) {
            return of(undefined);
        }
        try {
            if (!token) {
                throw new NotAllowedException(MessagesEnum['rest-no-token']);
            } else if (token.search(/^Bearer /) === -1) {
                throw new UnauthorizedException(MessagesEnum['rest-invalid-token']);
            }

            const tokenClaims: TokenClaims | undefined = this.getTokenClaims(token.replace('Bearer ', ''));

            if (profiles != undefined && profiles.length > 0) {
                this.verifyProfile(tokenClaims, profiles);
            }

            return of(tokenClaims);
        } catch(ex) {
            if (ex instanceof ApplicationException) {
                throw ex;
            } else {
                console.error(ex);
                throw new UnauthorizedException(MessagesEnum['rest-invalid-token']);
            }
        }
    }
}
