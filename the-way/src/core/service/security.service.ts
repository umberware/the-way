import * as Jwt from 'jsonwebtoken';

import { UnauthorizedException } from '../exeption/unauthorized.exception';
import { NotAllowedException } from '../exeption/not-allowed.exception';
import { ApplicationException } from '../exeption/application.exception';
import { CORE } from '../core';
import { CryptoService } from './crypto.service';

export abstract class SecurityService {

    protected TOKEN_KEY = 'Darth123456789987654321147852369963258741794613287391465Vader';
    protected USER_PRIVATE_KEY = 'Darth123456789987654321147852369963258741794613287391465Vader';

    public generateToken(user: any): string {
        const cryptoService = CORE.getInstance().getInjectableByName('CryptoService') as CryptoService;
        const cryptedUser: string = cryptoService.cypher(JSON.stringify(user), 'aes-256-cbc', this.TOKEN_KEY);
        return Jwt.sign({data: cryptedUser}, this.TOKEN_KEY, { expiresIn: '3 days' });
    }
    public getDecodedUser(token: string): any {
        const cryptoService = CORE.getInstance().getInjectableByName('CryptoService') as CryptoService;
        const claims: any = Jwt.verify(token, this.TOKEN_KEY);
        return JSON.parse(cryptoService.decypher(claims.data, 'aes-256-cbc', this.USER_PRIVATE_KEY));
    }
    private verifyProfile(user: any, profiles: Array<any>) {
        for (let profile of profiles) {
          if (user.profiles.includes(profile)) {
            return;
          }
        }
    
        throw new NotAllowedException('You cannot perform that.');
    }
    public verifyToken(token: string, profiles: Array<any> | undefined): any {
        try {
            if (!token) {
                throw new NotAllowedException('You have no token.');
            }
            token = token.replace('Bearer ', '');
            let decodedUser = this.getDecodedUser(token);
            let tokenUser: any = decodedUser;

            if (profiles && profiles.length > 0) {
                this.verifyProfile(tokenUser, profiles);
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