import * as Jwt from 'jsonwebtoken';

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

    public generateToken(tokenClaims: TokenClaims): string {
        const cryptoService = CORE.getCoreInstance().getInstanceByName('CryptoService') as CryptoService;
        const cryptedUser: string = cryptoService.cipherIv(JSON.stringify(tokenClaims), 'aes-256-cbc', this.getUserKey());
        return Jwt.sign({data: cryptedUser}, this.getTokenKey(), { expiresIn: this.getTokenExpiration() });
    }
    public getTokenClaims(token: string): TokenClaims {
        const cryptoService = CORE.getCoreInstance().getInstanceByName('CryptoService') as CryptoService;
        const claims = Jwt.verify(token, this.getTokenKey()) as {data: string};
        if (claims.data) {
            return JSON.parse(cryptoService.decipherIv(claims.data, 'aes-256-cbc', this.getUserKey()));
        } else {
            return {};
        }
    }
    protected getUserKey(): string {
        const theWayProperties = this.propertiesConfiguration.properties['the-way'];
        const serverProperties = theWayProperties['server'];
        return serverProperties.security['user-key'] as string;
    }
    protected getTokenKey(): string {
        const theWayProperties = this.propertiesConfiguration.properties['the-way'];
        const serverProperties = theWayProperties['server'];
        return serverProperties.security['token-key'] as string;
    }
    protected getTokenExpiration(): string {
        const theWayProperties = this.propertiesConfiguration.properties['the-way'];
        const serverProperties = theWayProperties['server'];
        return serverProperties.security['token-expiration'] as string;
    }
    protected mustValidateTheProfiles(tokenProfiles: Array<any>, profiles: Array<any> | undefined): boolean {
        return profiles != undefined && profiles.length > 0 && tokenProfiles && tokenProfiles.length > 0;
    }
    protected verifyProfile(tokenProfiles: Array<any>, profiles: Array<any> | undefined): void{
        if (profiles != undefined) {
            for (const profile of profiles) {
                if (tokenProfiles.includes(profile)) {
                    return;
                }
            }
        }

        throw new NotAllowedException(MessagesEnum['rest-cannot-perform']);
    }
    public verifyToken(token: string, profiles: Array<any> | undefined): TokenClaims {
        try {
            if (!token) {
                throw new NotAllowedException(MessagesEnum['rest-no-token']);
            }
            const tokenClaims: TokenClaims = this.getTokenClaims(token.replace('Bearer ', ''));

            if (this.mustValidateTheProfiles(tokenClaims.profiles, profiles)) {
                this.verifyProfile(tokenClaims.profiles, profiles);
            }

            return tokenClaims;
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
