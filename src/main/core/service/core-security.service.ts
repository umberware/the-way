import * as Jwt from 'jsonwebtoken';

import { Service } from '../decorator/component/service.decorator';
import { System } from '../decorator/component/system.decorator';
import { Inject } from '../decorator/component/inject.decorator';
import { PropertiesHandler } from '../handler/properties.handler';
import { TokenClaims } from '../shared/model/token-claims.model';
import { CoreCryptoService } from './core-crypto.service';
import { PropertyModel } from '../shared/model/property.model';
import { NotAllowedException } from '../exeption/not-allowed.exception';
import { CoreMessageService } from './core-message.service';
import { UnauthorizedException } from '../exeption/unauthorized.exception';
import { RestException } from '../exeption/rest.exception';

/* eslint-disable @typescript-eslint/no-explicit-any, max-len */
/**
 * @class CoreSecurityService
 * @description This class is responsible to verify the user authenticity or generate the user authenticity,
 *  with an embedded JWT mechanism. All paths marked with "true" in the "authenticated" param, will call this class
 *  to verify the user authenticity. The generation of the user authenticity(with JWT token), is triggered manually
 *  and you can check how do to this in the guide
 *  [The Way: Custom Security Service](https://github.com/umberware/the-way/blob/master/documentation/guides/the-way-custom-security-service.md)
 *  or in the [source code](https://github.com/umberware/the-way-examples/tree/master/examples/custom-security-rest/).
 *  It's important to know that these behaviors can be customized/overridden
 *  with a custom CoreSecurityService, so you can change the default JWT engine to an OAUTH 2.0 for example
 * */
@System
@Service()
export class CoreSecurityService {

    @Inject protected propertiesHandler: PropertiesHandler;
    @Inject protected cryptoService: CoreCryptoService;

    protected cipherClaims(tokenClaims: TokenClaims | undefined): string | undefined {
        if (!tokenClaims) {
            return;
        }

        return this.cryptoService.cipherIv(JSON.stringify(tokenClaims), 'aes-256-cbc', this.getUserKey());
    }
    /**
     * @method generateToken
     * @description This method is used to generate a JWT token to provide the user authenticity.
     *  The default implementation, uses the `the-way.server.rest.security` properties
     *  and you must change the keys if you want to use the default implementation. Actually, we use the
     *  library [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken) to provide and verify the JWT token.
     * @param tokenClaims Is a JSON object with the information that will be a part of the token.
     *  TokenClaims is encrypted with aes-256-cbc.
     * @return The resultant JWT token
     * */
    public generateToken(tokenClaims?: TokenClaims): string {
        const encryptedClaims: string | undefined = this.cipherClaims(tokenClaims);
        return Jwt.sign(
            { data: encryptedClaims },
            this.getTokenKey(),
            { expiresIn: this.getTokenExpiration() }
        );
    }
    protected getTokenClaims(token: string): TokenClaims | undefined {
        const claims = Jwt.verify(token, this.getTokenKey()) as {data: string};

        if (claims.data) {
            return JSON.parse(this.cryptoService.decipherIv(claims.data, 'aes-256-cbc', this.getUserKey()));
        } else {
            return undefined;
        }
    }
    protected getUserKey(): string {
        const restSecurityProperties = this.propertiesHandler.getProperties(
            'the-way.server.rest.security'
        ) as PropertyModel;
        return restSecurityProperties['user-key'] as string;
    }
    protected getTokenKey(): string {
        const restSecurityProperties = this.propertiesHandler.getProperties(
            'the-way.server.rest.security'
        ) as PropertyModel;
        return restSecurityProperties['token-key'] as string;
    }
    protected getTokenExpiration(): string {
        const restSecurityProperties = this.propertiesHandler.getProperties(
            'the-way.server.rest.security'
        ) as PropertyModel;
        return restSecurityProperties['token-expiration'] as string;
    }
    protected hasFatherProfile(tokenProfiles: Array<any>, fatherProfiles: Array<any>): boolean {
        return (fatherProfiles) ? this.hasProfile(tokenProfiles, fatherProfiles) : true;
    }
    protected hasPathProfile(tokenProfiles: Array<any>, profiles: Array<any>): boolean {
        return (profiles) ? this.hasProfile(tokenProfiles, profiles) : true;
    }
    protected hasProfile(profiles: Array<any>, allowedProfiles: Array<any>,): boolean {
        for (const allowedProfile of allowedProfiles) {
            for (const profile of profiles) {
                if (JSON.stringify(profile) === JSON.stringify(allowedProfile)) {
                    return true;
                }
            }
        }
        return false;
    }
    protected isPathRestrictedToProfiles(profiles: Array<any> | undefined, fatherProfiles: Array<any> | undefined): boolean {
        return (profiles !== undefined && profiles.length > 0) ||
            (fatherProfiles !== undefined && fatherProfiles.length > 0);
    }
    protected verifyProfile(token: TokenClaims | undefined, profiles: Array<any>, fatherProfiles: Array<any>): void{
        if (!token || !token.profiles || !(token.profiles instanceof Array)) {
            throw new NotAllowedException(CoreMessageService.getMessage('error-rest-cannot-perform-action'));
        }

        const tokenProfiles: Array<any> = token.profiles;
        if (!this.hasFatherProfile(tokenProfiles, fatherProfiles) || !this.hasPathProfile(tokenProfiles, profiles)) {
            throw new NotAllowedException(CoreMessageService.getMessage('error-rest-cannot-perform-action'));
        }
    }
    /**
     * @method verifyAuthentication
     * @description This method will check if the logged user can access the path, evaluating the token
     * and the profiles in the token claims
     * @param token is the logged user token
     * @param fatherPathProfiles is an array of profiles allowed to use the operations
     *  inside a father path
     * @param profiles is an array of profiles allowed to use the current operation(path)
     * @return The return of the verification is the TokenClaims decrypted from the token
     * */
    public verifyAuthentication(
        token?: string,
        fatherPathProfiles?: Array<any>,
        profiles?: Array<any>
    ): TokenClaims | undefined {
        try {
            if (!token) {
                throw new UnauthorizedException(CoreMessageService.getMessage('error-rest-no-token'));
            } else if (token.search(/^Bearer /) === -1) {
                throw new UnauthorizedException(CoreMessageService.getMessage('error-rest-invalid-token'));
            }

            const tokenClaims: TokenClaims | undefined = this.getTokenClaims(token.replace('Bearer ', ''));

            if (this.isPathRestrictedToProfiles(profiles, fatherPathProfiles)) {
                this.verifyProfile(
                    tokenClaims,
                    profiles as Array<any>,
                    fatherPathProfiles as Array<any>
                );
            }

            return tokenClaims;
        } catch(ex) {
            if (ex instanceof RestException) {
                throw ex;
            } else {
                console.error(ex);
                throw new UnauthorizedException(CoreMessageService.getMessage('error-rest-invalid-token'));
            }
        }
    }
}
