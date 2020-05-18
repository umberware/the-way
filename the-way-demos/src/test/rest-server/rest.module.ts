import { Inject } from '@nihasoft/the-way'
import { UserRest } from './user.rest';

export class RestModule {
    @Inject() userRest: UserRest;
}