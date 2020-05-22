import * as Jwt from 'jsonwebtoken';

import { UnauthorizedException } from '../exeption/unauthorized.exception';
import { NotAllowedException } from '../exeption/not-allowed.exception';
import { ApplicationException } from '../exeption/application.exception';
import { CORE } from '../core';
import { CryptoService } from './crypto.service';
import { PropertiesConfiguration } from '../configuration/properties.configuration';
import { Inject } from '../decorator/inject.decorator';
import { TokenClaims } from '../model/token-claims.model';

export class SecurityService {

    @Inject() propertiesConfiguration: PropertiesConfiguration;

    public generateToken(tokenClaims: TokenClaims): string {
        const cryptoService = CORE.getCoreInstance().getInstanceByName('CryptoService') as CryptoService;
        const cryptedUser: string = cryptoService.cipherIv(JSON.stringify(tokenClaims), 'aes-256-cbc', this.getUserKey());
        return Jwt.sign({data: cryptedUser}, this.getTokenKey(), { expiresIn: '3 days' });
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
        const theWayProperties = this.propertiesConfiguration.properties['the-way'] as any;
        const serverProperties = theWayProperties['server'] as any;
        return (serverProperties.security as any)['user-key'] as string;
    }
    protected getTokenKey(): string {
        const theWayProperties = this.propertiesConfiguration.properties['the-way'] as any;
        const serverProperties = theWayProperties['server'] as any;
        return (serverProperties.security as any)['token-key'] as string;
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
    
        throw new NotAllowedException('You cannot perform that.');
    }
    public verifyToken(token: string, profiles: Array<any> | undefined): TokenClaims {
        try {
            if (!token) {
                throw new NotAllowedException('You have no token.');
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
                throw new UnauthorizedException('Invalid token');
            }
        }
    }
}