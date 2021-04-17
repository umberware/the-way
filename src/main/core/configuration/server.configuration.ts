import * as Http from 'http';
import * as Https from 'https';
import { readFileSync } from 'fs';
import * as SwaggerUi from 'swagger-ui-express';

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
        const privateKey = readFileSync(httpsProperties.keyPath as string, 'utf8');
        const certificate = readFileSync(httpsProperties.certPath as string, 'utf8');

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
    protected handleServer(
        observer: Subscriber<void>,
        server: Http.Server | Https.Server,
        properties: PropertyModel
    ): void {
        const messageKey = (server instanceof Http.Server) ? 'http-server-running' : 'https-server-running';
        server.listen(properties.port, () => {
            this.logger.info(Messages.getMessage(messageKey, [properties.port as string]));
            observer.next();
        });
        server.on('error', (error: any) => {
            observer.error(
                new ApplicationException(
                    Messages.getMessage('error-server-error', [error.code]),
                    Messages.getMessage('TW-012'),
                    error
                )
            );
        });
    }
    protected initializeExpress(): void {
        const helmetProperties = this.serverProperties.helmet as PropertyModel;
        const corsProperties = this.serverProperties.cors as PropertyModel;
        const httpProperties = this.serverProperties.http as PropertyModel;
        const httpsProperties = this.serverProperties.https as PropertyModel;

        if (!httpProperties.enabled && !httpsProperties.enabled) {
            return;
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
    public initializeFileServer(): void {
        this.logger.debug(Messages.getMessage('http-file-enabled'), '[The Way]');
        const fileProperties = this.serverProperties.file as any;
        const filePath: string = this.buildPath(fileProperties, process.cwd());

        const assetsProperty = fileProperties.assets as any;
        const staticProperty = fileProperties.static as any;

        if (assetsProperty.enabled) {
            this.serverContext.use('/assets', express.static(this.buildPath(assetsProperty, filePath)));
        }

        if (staticProperty.enabled) {
            this.serverContext.use('/static', express.static(this.buildPath(staticProperty, filePath)));
        }

        this.serverContext.get('/*', (req: any, res: any, next: any) => {
            if (req.path === '/' || (fileProperties.fallback && !this.isApiPath(req.path))) {
                res.sendFile(filePath + '/index.html');
            } else {
                next();
            }
        });
    }
    protected initializeHttpServer(): Observable<void> {
        return new Observable<void>((observer: Subscriber<void>) => {
            const httpProperties = this.serverProperties.http as PropertyModel;
            if (!httpProperties.enabled) {
                observer.next();
            } else {
                this.httpServer = Http.createServer(this.serverContext);
                this.handleServer(observer, this.httpServer, httpProperties);
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
                this.handleServer(observer, this.httpsServer, httpsProperties);
            }
        });
    }
    protected initializeServer(): Observable<void> {
        return zip(
            this.initializeHttpServer().pipe(take(1)),
            this.initializeHttpsServer().pipe(take(1))
        ).pipe(map(() => {}));
    }
    protected initializeSwagger(): void {
        this.logger.debug(Messages.getMessage('http-swagger-enabled'), '[The Way]');
        const restProperties = this.serverProperties.rest as any;
        const swaggerProperties = restProperties.swagger;
        const swaggerDoc = readFileSync(swaggerProperties.filePath);
        this.serverContext.use(
            restProperties.path + swaggerProperties.path,
            SwaggerUi.serve,
            SwaggerUi.setup(JSON.parse(swaggerDoc.toString()))
        );
    }
    protected isApiPath(req: any): boolean {
        const rest = (this.serverProperties.rest as PropertyModel) as PropertyModel;
        const path = req.path as string;
        return path.includes(rest.path as string);
    }
    protected isFileServerEnabled(): boolean {
        const fileProperties = this.serverProperties.file  as PropertyModel;
        return fileProperties &&
            fileProperties.enabled as boolean;
    }
    protected isSwaggerEnabled(): boolean {
        const swagger = (this.serverProperties.rest as PropertyModel).swagger as PropertyModel;
        return swagger !== undefined &&
            (swagger as PropertyModel).enabled as boolean;
    }
    protected start(): Observable<void> {
        this.logger.info(Messages.getMessage('http-server-initialization'));
        this.initializeExpress();

        if (this.isSwaggerEnabled()) {
            this.initializeSwagger();
        }

        if (this.isFileServerEnabled())   {
            this.initializeFileServer();
        }

        return this.initializeServer();
    }
}
