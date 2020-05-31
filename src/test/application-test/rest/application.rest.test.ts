import { Inject } from '../../../main';
import { HeroRestTest } from './hero.rest.test';
import { UserRestTest } from './user.rest.test';

export class ApplicationRestTest {
    @Inject() heroRest: HeroRestTest;
    @Inject() userRest: UserRestTest;
}