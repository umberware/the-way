import * as Http from 'http';
import * as Https from 'https';
import { readFileSync } from 'fs';

import { Observable, Subscriber, zip } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Express } from 'express';
import express = require('express');
import morgan = require('morgan');
import helmet = require('helmet');
import cors = require('cors');
import bodyParser = require('body-parser');

import { Configuration }  from '../decorator/configuration.decorator';
import { Inject } from '../decorator/inject.decorator';
import { PropertiesHandler } from '../handler/properties.handler';
import { PropertyModel } from '../model/property.model';
import { System } from '../decorator/system.decorator';
import { Configurable } from '../shared/configurable';
import { Logger } from '../shared/logger';
import { Messages } from '../shared/messages';
import { ApplicationException } from '../exeption/application.exception';

@System
@Configuration()
export class ServerConfiguration extends Configurable {
    @Inject logger: Logger;
    @Inject propertiesHandler: PropertiesHandler;

    protected serverProperties: PropertyModel;
    protected serverContext: Express;
    public httpServer: Http.Server;
    public httpsServer: Https.Server;

    protected buildCredentialsOptions(httpsProperties: PropertyModel): { key: string; cert: string } {
        const privateKey  = readFileSync(httpsProperties.keyPath as string, 'utf8');
        const certificate = readFileSync(httpsProperties.certPath as string, 'utf8');

        return { key: privateKey, cert: certificate };
    }
    public configure(): void | Observable<void> {
        this.serverProperties = this.propertiesHandler.getProperties('the-way.server') as PropertyModel;
        if (!this.serverProperties.enabled) {
            return;
        } else {
            return this.start();
        }
    }
    protected destroyHttpServer(): Observable<void> {
        return new Observable<void>((observer: Subscriber<void>) => {
            if (this.httpServer) {
                this.httpServer.close(() => {
                    observer.next();
                });
            } else {
                observer.next();
            }
        });
    }
    protected destroyHttpsServer(): Observable<void> {
        return new Observable<void>((observer: Subscriber<void>) => {
            if (this.httpsServer) {
                this.httpsServer.close(() => {
                    observer.next();
                });
            } else {
                observer.next();
            }
        });
    }
    public destroy(): Observable<void> {
        return zip(
            this.destroyHttpServer().pipe(take(1)),
            this.destroyHttpsServer().pipe(take(1)),
        ).pipe(
            map(() => {})
        );
    }
    protected initializeExpress(): void {
        const helmetProperties = this.serverProperties.helmet as PropertyModel;
        const corsProperties = this.serverProperties.cors as PropertyModel;
        const httpProperties = this.serverProperties.http as PropertyModel;
        const httpsProperties = this.serverProperties.https as PropertyModel;

        if (!httpProperties.enabled && !httpsProperties.enabled) {
            return
        }

        if (httpProperties.enabled && (this.serverProperties.file as PropertyModel).enabled) {
            helmetProperties.contentSecurityPolicy = false;
        }

        this.serverContext = express();

        if (helmetProperties.enabled) {
            this.initializeExpressHelmet(helmetProperties);
        }
        if (corsProperties.enabled) {
            this.initializeExpressCors(corsProperties);
        }
        if (this.serverProperties['operations-log']) {
            this.initializeExpressOperationsLog();
        }

        this.serverContext
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: false }));
    }
    protected initializeExpressHelmet(helmetProperties: any): void {
        delete helmetProperties.enabled;
        this.serverContext.use(helmet(helmetProperties));
    }
    protected initializeExpressCors(corsProperties: any): any {
        delete corsProperties.enabled;
        this.serverContext.use(cors(corsProperties));
    }
    protected initializeExpressOperationsLog(): any {
        this.serverContext.use(morgan('dev'));
    }
    protected initializeHttpServer(): Observable<void> {
        return new Observable<void>((observer: Subscriber<void>) => {
            const httpProperties = this.serverProperties.http as PropertyModel;
            if (!httpProperties.enabled) {
                observer.next();
            } else {
                this.httpServer = Http.createServer(this.serverContext);
                this.httpServer.listen(httpProperties.port, () => {
                    this.logger.info(Messages.getMessage('http-server-running', [ httpProperties.port as string ]));
                    observer.next();
                });
                this.httpServer.on('error', (error: any) => {
                    observer.error(
                        new ApplicationException(
                            Messages.getMessage('error-server-error', [ error.code ]),
                            Messages.getMessage('TW-012'),
                            error
                        )
                    );
                });
            }
        });
    }
    protected initializeHttpsServer(): Observable<void> {
        return new Observable<void>((observer: Subscriber<void>) => {
            const httpsProperties = this.serverProperties.https as PropertyModel;
            if (!httpsProperties.enabled) {
                observer.next();
            } else {
                const credentials = this.buildCredentialsOptions(httpsProperties);
                this.httpsServer = Https.createServer(credentials, this.serverContext);
                this.httpsServer.listen(httpsProperties.port, () => {
                    this.logger.info(Messages.getMessage('https-server-running', [ httpsProperties.port as string ]));
                    observer.next();
                });
                this.httpsServer.on('error', (error: any) => {
                    observer.error(
                        new ApplicationException(
                            Messages.getMessage('error-server-error', [ error.code ]),
                            Messages.getMessage('TW-012'),
                            error
                        )
                    );
                });
            }
        });
    }
    protected initializeServer(): Observable<void> {
        return zip(
            this.initializeHttpServer().pipe(take(1)),
            this.initializeHttpsServer().pipe(take(1))
        ).pipe(map(() => {}));
    }
    protected start(): Observable<void> {
        this.logger.info(Messages.getMessage('http-server-initialization'));
        this.initializeExpress();
        return this.initializeServer();
        // if (this.isFileServerEnabled())   {
        //     this.initializeFileServer();
        // }
        // if (this.isSwaggerEnabled())   {
        //     this.initializeSwagger();
        // }
    }
}
