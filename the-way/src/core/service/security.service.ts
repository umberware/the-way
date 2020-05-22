import * as Jwt from 'jsonwebtoken';

import { UnauthorizedException } from '../exeption/unauthorized.exception';
import { NotAllowedException } from '../exeption/not-allowed.exception';
import { ApplicationException } from '../exeption/application.exception';
import { CORE } from '../core';
import { CryptoService } from './crypto.service';
import { PropertiesConfiguration } from '../configuration/properties.configuration';
import { Inject } from '../decorator/inject.decorator';

export abstract class SecurityService {

    @Inject() propertiesConfiguration: PropertiesConfiguration;

    public generateToken(user: unknown): string {
        const cryptoService = CORE.getCoreInstance().getInstanceByName('CryptoService') as CryptoService;
        const cryptedUser: string = cryptoService.cipherIv(JSON.stringify(user), 'aes-256-cbc', this.getUserKey());
        return Jwt.sign({data: cryptedUser}, this.getTokenKey(), { expiresIn: '3 days' });
    }
    public getDecodedUser(token: string): Record<string, never> {
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
    protected verifyProfile(userProfiles: Array<unknown>, profiles: Array<unknown>): void{
        for (const profile of profiles) {
            if (userProfiles.includes(profile)) {
                return;
            }
        }
    
        throw new NotAllowedException('You cannot perform that.');
    }
    public verifyToken(token: string, profiles: Array<unknown> | undefined): Object {
        try {
            if (!token) {
                throw new NotAllowedException('You have no token.');
            }
            token = token.replace('Bearer ', '');
            const tokenUser: Record<string, never> = this.getDecodedUser(token);

            if (profiles && profiles.length > 0) {
                this.verifyProfile(tokenUser.profiles, profiles);
            }

            return tokenUser;
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