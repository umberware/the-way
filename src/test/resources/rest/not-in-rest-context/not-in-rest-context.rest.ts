import { Get, Service } from '../../../../main';
import { Observable, of } from 'rxjs';

@Service()
export class NotInRestContextRest {
    @Get('heroes')
    public getAllHeroes(): Observable<any> {
        return of([]);
    }
}