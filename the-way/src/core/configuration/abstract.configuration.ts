import { Observable, of } from 'rxjs';

export abstract class AbstractConfiguration {
    public configure(): Observable<boolean> {
        return of(true);
    };
}