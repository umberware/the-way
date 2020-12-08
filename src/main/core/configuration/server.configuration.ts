import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as http from 'http';
import * as https from 'https';
import * as SwaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';

import { Observable, of, Subscriber, zip } from 'rxjs';
import{ map } from 'rxjs/operators';

import { Logger } from '../shared/logger';
import { AbstractConfiguration } from './abstract.configuration';
import { Configuration } from '../decorator/configuration.decorator';
import { PropertiesConfiguration } from './properties.configuration';
import { CORE } from '../core';
import { ApplicationException } from '../exeption/application.exception';
import { ErrorCodeEnum } from '../exeption/error-code.enum';
import { HttpType } from '../service/http/http-type.enum';
import { MessagesEnum } from '../model/messages.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
@Configuration()
export class ServerConfiguration extends AbstractConfiguration {
    protected logService: Logger;
    protected propertiesConfiguration: PropertiesConfiguration;

    public context: any;
    public httpServer: http.Server;
    public httpsServer: https.Server;
    protected theWayProperties: any;
    protected serverProperties: any;
    protected httpProperties: any;
    protected httpsProperties: any;

    constructor() {
        super();
        const core = CORE.getCoreInstances();
        this.logService = core.getInstanceByName<Logger>('LogService');
        this.propertiesConfiguration = core.getInstanceByName<PropertiesConfiguration>('PropertiesConfiguration');
        this.theWayProperties = this.propertiesConfiguration.properties['the-way'];
        this.serverProperties = this.theWayProperties.server;
        this.httpProperties = this.serverProperties.http;
        this.httpsProperties = this.serverProperties.https;
    }

    protected buildCredentialsOptions(): { key: string; cert: string } {
        const privateKey  = readFileSync(this.httpsProperties.keyPath, 'utf8');
        const certificate = readFileSync(this.httpsProperties.certPath, 'utf8');

        return { key: privateKey, cert: certificate };
    }
    private buildPath(fileProperty: any, beginPath: string): string {
        let path = fileProperty.path as string;
        if (!fileProperty.full) {
            if (path.charAt(0) !== '/') {
                path = '/' + path;
            }
            path = beginPath + path;
        }
        return path;
    }
    public configure(): Observable<boolean> {
        if (this.serverProperties.enabled) {
            if (!this.httpsProperties.enabled && !this.httpProperties.enabled) {
                throw new ApplicationException(
                    MessagesEnum['no-server'],
                    MessagesEnum['bad-request'],
                    ErrorCodeEnum['RU-007']
                );
            }
            return this.start();
        } else {
            return of(true);
        }
    }
    public destroy(): Observable<boolean> {
        return zip(
            this.destroyHttpServer(),
            this.destroyHttpsServer()
        ).pipe(
            map(() => true)
        );
    }
    protected destroyHttpServer(): Observable<boolean> {
        return new Observable<boolean>((observer: Subscriber<boolean>) => {
            if (this.httpServer) {
                this.httpServer.close(() => {
                    observer.next(true);
                });
            } else {
                observer.next(true);
            }
        });
    }
    protected destroyHttpsServer(): Observable<boolean> {
        return new Observable<boolean>((observer: Subscriber<boolean>) => {
            if (this.httpsServer) {
                this.httpsServer.close(() => {
                    observer.next(true);
                });
            } else {
                observer.next(true);
            }
        });
    }
    protected initializeExpress(): void {
        const helmetProperties = this.serverProperties.helmet;
        const corsProperties = this.serverProperties.cors;

        if (this.httpProperties.enabled && !helmetProperties.contentSecurityPolicy) {
            helmetProperties.contentSecurityPolicy = false;
        } else if (this.serverProperties.file.enabled) {
            this.logService.warn('Http enabled but with HELMET parameters. This can cause problems in file server.')
        }

        this.context = express();

        if (helmetProperties.enabled) {
            this.initializeExpressHelmet(helmetProperties);
        }
        if (corsProperties.enabled) {
            this.initializeExpressCors(corsProperties);
        }
        if (this.serverProperties['operations-log']) {
            this.initializeExpressOperationsLog();
        }

        this.context
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: false }));
    }
    protected initializeExpressHelmet(helmetProperties: any): void {
        delete helmetProperties.enabled;
        this.context.use(helmet(helmetProperties));
    }
    protected initializeExpressCors(corsProperties: any): any {
        delete corsProperties.enabled;
        this.context.use(cors(corsProperties));
    }
    protected initializeExpressOperationsLog(): any {
        this.context.use(morgan('dev'));
    }
    public initializeFileServer(): void {
        const fileProperties = this.serverProperties.file as any;
        const restProperties = this.serverProperties.rest as any;
        const filePath: string = this.buildPath(fileProperties, process.cwd());

        const assetsProperty = fileProperties.assets as any;
        const staticProperty = fileProperties.static as any;

        if (assetsProperty.enabled) {
            this.context.use('/assets', express.static(this.buildPath(assetsProperty, filePath)));
        }

        if (staticProperty.enabled) {
            this.context.use('/static', express.static(this.buildPath(staticProperty, filePath)));
        }

        this.context.get('/*', (req: any, res: any, next: any) => {
            if (req.path === '/' || (fileProperties.fallback && !(req.path as string).includes(restProperties.path as string))) {
                res.sendFile(filePath + '/index.html');
            } else {
                next();
            }
        });
    }
    protected initializeHttpServer(): Observable<boolean> {
        return new Observable<boolean>((observer: Subscriber<boolean>) => {
            if (!this.httpProperties.enabled) {
                observer.next(true);
            } else {
                this.httpServer = http.createServer(this.context);
                this.httpServer.listen(this.httpProperties.port, () => {
                    this.logService.info(`[The Way] HttpServer started on port ${this.httpProperties.port}`);
                    observer.next(true);
                });
                this.httpServer.on('error', (error: any) => {
                    if (error.code === 'EADDRINUSE') {
                        observer.error(
                            new ApplicationException(
                                MessagesEnum['server-couldnt-initialize'] + this.httpProperties.port,
                                MessagesEnum['server-port-in-use'],
                                ErrorCodeEnum['RU-007']
                            )
                        );
                    } else {
                        observer.error(error);
                    }
                });
            }
        });
    }
    protected initializeHttpsServer(): Observable<boolean> {
        return new Observable<boolean>((observer: Subscriber<boolean>) => {
            if (!this.httpsProperties.enabled) {
                observer.next(true);
            } else {
                const credentials = this.buildCredentialsOptions();
                this.httpsServer = https.createServer(credentials, this.context);
                this.httpsServer.listen(this.httpsProperties.port, () => {
                    this.logService.info(`[The Way] HttpsServer started on port ${this.httpsProperties.port}`);
                    observer.next(true);
                });
                this.httpsServer.on('error', (error: any) => {
                    if (error.code === 'EADDRINUSE') {
                        observer.error(
                            new ApplicationException(
                                MessagesEnum['server-couldnt-initialize'] + this.httpsProperties.port,
                                MessagesEnum['server-port-in-use'],
                                ErrorCodeEnum['RU-007']
                            )
                        );
                    } else {
                        observer.error(error);
                    }
                });
            }
        });
    }
    protected initializeServer(): Observable<boolean> {
        return zip(
            this.initializeHttpServer(),
            this.initializeHttpsServer()
        ).pipe(
            map(() => true)
        );
    }
    protected initializeSwagger(): void {
        const restProperties = this.serverProperties.rest as any;
        const swaggerProperties = restProperties.swagger;
        const swaggerDoc = readFileSync(swaggerProperties.filePath);
        this.context.use(
            restProperties.path + swaggerProperties.path,
            SwaggerUi.serve,
            SwaggerUi.setup(JSON.parse(swaggerDoc.toString()))
        );
    }
    protected isFileServerEnabled(): boolean {
        return this.serverProperties.file && this.serverProperties.file.enabled;
    }
    protected isSwaggerEnabled(): boolean {
        return this.serverProperties.swagger && this.serverProperties.swagger.enabled;
    }
    protected start(): Observable<boolean> {
        this.initializeExpress();
        if (this.isFileServerEnabled())   {
            this.initializeFileServer();
        }
        if (this.isSwaggerEnabled())   {
            this.initializeSwagger();
        }
        return this.initializeServer();
    }
    public registerPath(path: string, httpType: HttpType, executor: any): void {
        const restProperties = this.serverProperties.rest as any;
        const finalPath = restProperties.path + path;

        this.logService.debug('Registered - ' + httpType.toUpperCase() + ' ' + finalPath);
        this.context[httpType](finalPath, executor);
    }
}
