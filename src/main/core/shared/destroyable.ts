import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class Destroyable {
    public abstract destroy(): Observable<any> | Promise<any> | any;
}
