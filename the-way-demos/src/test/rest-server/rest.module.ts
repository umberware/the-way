import { Inject } from '@nihasoft/the-way'
import { UserRest } from './user.rest';
import { HeroRest } from './hero.rest';

export class RestModule {
    @Inject() userRest: UserRest;
    @Inject() heroRest: HeroRest;
}