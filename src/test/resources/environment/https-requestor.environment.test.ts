import * as Https from 'https';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CORE, PropertyModel } from '../../../main';

/*eslint-disable @typescript-eslint/no-explicit-any*/
export class HttpsRequestorEnvironment {
    public static Post<T>(body: any, path: string, headers: any = {}): Observable<T> {
        const { hostname, port } = this.getHostnameAndPort();
        return new Observable<T>((observer) => {
            const data = (body) ? JSON.stringify(body): undefined;
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'POST',
                rejectUnauthorized: false,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Https.request(options, (res) => {
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
                rejectUnauthorized: false,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Https.request(options, (res) => {
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
                rejectUnauthorized: false,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Https.request(options, (res) => {
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
                rejectUnauthorized: false,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Https.request(options, (res) => {
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
    public static Head<T>(path: string, headers: any = {}): Observable<T> {
        return new Observable<T>((observer) => {
            const {hostname, port} = this.getHostnameAndPort();
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'HEAD',
                rejectUnauthorized: false,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Https.request(options, (res) => {
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
    public static GetNoParse<T>(path: string, headers: any = {}): Observable<T> {
        return new Observable<T>((observer) => {
            const { hostname, port } = this.getHostnameAndPort();
            const options = {
                hostname: hostname,
                port: port,
                path: path,
                method: 'GET',
                rejectUnauthorized: false,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            }
            const req = Https.request(options, (res) => {
                res.on('data', (d) => {
                    if (res.statusCode !== 200 && res.statusCode !== 302) {
                        observer.error(d);
                        observer.complete();
                    } else {
                        observer.next(d);
                        observer.complete();
                    }
                })
            })
            req.on('error', (error: Error) => {
                observer.error(error);
                observer.complete();
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
                rejectUnauthorized: false,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
            }
            const req = Https.request(options, (res) => {
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
        const serverProperties = CORE.getPropertiesHandler().getProperties('the-way.server') as PropertyModel;
        const hostname = 'localhost';
        const port = (serverProperties.https as PropertyModel).port as number;
        return { hostname, port };
    }
}