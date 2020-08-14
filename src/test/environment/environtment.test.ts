import * as Http from 'http';

import { timer, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CORE } from '../../main/core/core';
import { PropertiesConfiguration } from '../../main/core/configuration/properties.configuration';

/*eslint-disable @typescript-eslint/no-explicit-any*/
export class EnvironmentTest {
    public static Post<T>(body: any, path: string, headers: any = {}): Observable<T> {
        const {hostname, port} = this.getHostnameAndPort();
        return new Observable<T>((observer) => {
            const data = (body) ? JSON.stringify(body): undefined;
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Http.request(options, (res) => {
                res.on('data', (d) => {
                    if (res.statusCode !== 200 && res.statusCode !== 302) {
                        observer.error(JSON.parse(d));
                    } else {
                        observer.next(JSON.parse(d));
                    }
                })
            })
            req.on('error', (error: Error) => {
                observer.error(error);
            })
            if (data) {
                req.write(data);
            }
            req.end();
        }).pipe(take(1));
    }
    public static Put<T>(body: any, path: string, headers: any = {}): Observable<T> {
        const {hostname, port} = this.getHostnameAndPort();
        return new Observable<T>((observer) => {
            const data = (body) ? JSON.stringify(body): undefined;
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'PUT',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Http.request(options, (res) => {
                res.on('data', (d) => {
                    if (res.statusCode !== 200 && res.statusCode !== 302) {
                        observer.error(JSON.parse(d));
                    } else {
                        observer.next(JSON.parse(d));
                    }
                })
            })
            req.on('error', (error: Error) => {
                observer.error(error);
            })
            if (data) {
                req.write(data);
            }
            req.end();
        }).pipe(take(1));
    }
    public static Patch<T>(body: any, path: string, headers: any = {}): Observable<T> {
        const {hostname, port} = this.getHostnameAndPort();
        return new Observable<T>((observer) => {
            const data = (body) ? JSON.stringify(body): undefined;
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'PATCH',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Http.request(options, (res) => {
                res.on('data', (d) => {
                    if (res.statusCode !== 200 && res.statusCode !== 302) {
                        observer.error(JSON.parse(d));
                    } else {
                        observer.next(JSON.parse(d));
                    }
                })
            })
            req.on('error', (error: Error) => {
                observer.error(error);
            })
            if (data) {
                req.write(data);
            }
            req.end();
        }).pipe(take(1));
    }
    public static Get<T>(path: string, headers: any = {}): Observable<T> {
        return new Observable<T>((observer) => {
            const {hostname, port} = this.getHostnameAndPort();
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Http.request(options, (res) => {
                res.on('data', (d) => {
                    if (res.statusCode !== 200 && res.statusCode !== 302) {
                        observer.error(JSON.parse(d));
                    } else {
                        observer.next(JSON.parse(d));
                    }
                })
            })
            req.on('error', (error: Error) => {
                observer.error(error);
            })
            req.end();
        }).pipe(take(1));
    }
    public static GetNoParse<T>(path: string, headers: any = {}): Observable<T> {
        return new Observable<T>((observer) => {
            const {hostname, port} = this.getHostnameAndPort();
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Http.request(options, (res) => {
                res.on('data', (d) => {
                    if (res.statusCode !== 200 && res.statusCode !== 302) {
                        observer.error(d);
                    } else {
                        observer.next(d);
                    }
                })
            })
            req.on('error', (error: Error) => {
                observer.error(error);
            })
            req.end();
        }).pipe(take(1));
    }
    public static Head<T>(path: string, headers: any = {}): Observable<T> {
        return new Observable<T>((observer) => {
            const {hostname, port} = this.getHostnameAndPort();
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'HEAD',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Http.request(options, (res) => {
                if (res.statusCode === 200) {
                    observer.next();
                } else {
                    observer.error();
                }
                res.on('data', (d) => {
                    if (res.statusCode !== 200 && res.statusCode !== 302) {
                        observer.error(JSON.parse(d));
                    } else {
                        observer.next(JSON.parse(d));
                    }
                })
            })
            req.on('error', (error: Error) => {
                observer.error(error);
            })
            req.end();
        }).pipe(take(1));
    }
    public static Delete<T>(path: string, headers: any = {}): Observable<T> {
        return new Observable<T>((observer) => {
            const {hostname, port} = this.getHostnameAndPort();
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'DELETE',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Http.request(options, (res) => {
                res.on('data', (d) => {
                    if (res.statusCode !== 200 && res.statusCode !== 302) {
                        observer.error(JSON.parse(d));
                    } else {
                        observer.next(JSON.parse(d));
                    }
                })
            })
            req.on('error', (error: Error) => {
                observer.error(error);
            })
            req.end();
        }).pipe(take(1));
    }
    public static getHostnameAndPort(): {hostname: string; port: number} {
        const serverProperties = this.getProperties()['the-way'].server;
        const hostname = 'localhost';
        const port = serverProperties.port;
        return { hostname, port };
    }
    public static getInstance<T>(name: string): T {
        const core: CORE = CORE.getCoreInstance();
        return core.getInstanceByName(name);
    }
    public static getMain<T>(): T {
        const core: CORE = CORE.getCoreInstance();
        return core.getApplicationInstance();
    }
    public static getProperties(): any {
        return this.getInstance<PropertiesConfiguration>('PropertiesConfiguration').properties;
    }
    public static getTokenKey(): string {
        const theWayProperties = this.getProperties()['the-way'];
        const serverProperties = theWayProperties['server'];
        return serverProperties.security['token-key'] as string;
    }
    public static getTokenExpiration(): string {
        const theWayProperties = this.getProperties()['the-way'];
        const serverProperties = theWayProperties['server'];
        return serverProperties.security['token-expiration'] as string;
    }
    public static prepareEnvironment(whenReady: Function): void {
        this.whenCoreReady(whenReady);
    }
    public static whenCoreReady(whenReady: Function): void {
        CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                ready = true;
                timer(2000).subscribe(() => {
                    const core = CORE.getCoreInstance();
                    expect(core.getApplicationInstance()).not.toBeUndefined();
                    whenReady();
                })
            }
        })
    }
    public static whenCoreWasDestroyed(whenDestroyed: Function): void {
        CORE.getCoreInstance().destroy().subscribe(
            (destroyed: boolean) => {
                if (destroyed) {
                    expect(CORE.instance).toBeUndefined();
                    whenDestroyed();
                }
            }, (error: Error) => {
                throw error;
            }
        );
    }
}