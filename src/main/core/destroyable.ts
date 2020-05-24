import { Observable } from 'rxjs';

export abstract class Destroyable {
    public abstract destroy(): Observable<boolean>;
}