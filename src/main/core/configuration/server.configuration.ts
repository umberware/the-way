import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as http from 'http';
import * as SwaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';

import { Observable, Subscriber } from 'rxjs';

import { LogService } from '../service/log/log.service';
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
    protected logService: LogService;
    protected propertiesConfiguration: PropertiesConfiguration;

    public context: any;
    public server: http.Server;
    public port: number;
    protected theWayProperties: any;
    protected serverProperties: any;

    constructor() {
        super();
        const core = CORE.getCoreInstance();
        this.logService = core.getInstanceByName<LogService>('LogService');
        this.propertiesConfiguration = core.getInstanceByName<PropertiesConfiguration>('PropertiesConfiguration');
        this.theWayProperties = this.propertiesConfiguration.properties['the-way'];
        this.serverProperties = this.theWayProperties.server;
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
        this.port =  this.serverProperties.port as number;
        return this.start();
    }
    public destroy(): Observable<boolean> {
        return new Observable((observer: { next: (arg0: boolean) => void; }) => {
            if (!this.server) {
                observer.next(true);
            }

            this.server.close(() => {
                observer.next(true);
            });
        });
    }
    protected initializeExpress(): void {
        const corsOptions: cors.CorsOptions = {
            origin: true
        };
        this.context = express();
        this.context
            .use(cors(corsOptions))
            .use(morgan('dev'))
            .use(bodyParser.json())
            .use(helmet())
            .use(bodyParser.urlencoded({ extended: false }));
    }
    public initializeFileServer(): void {
        const server = this.theWayProperties.server;
        const fileProperties = server.file as any;
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
            if (req.path === '/' || (fileProperties.fallback && !(req.path as string).includes(server.path as string))) {
                res.sendFile(filePath + '/index.html');
            } else {
                next();
            }
        });
    }
    protected initializeServer(observer: Subscriber<boolean>): void {
        this.server = http.createServer(this.context);
        this.server.listen(this.port, () => {
            this.logService.info(`Server started on port ${this.port}`);
            observer.next(true);
        });
        this.server.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                observer.error(new ApplicationException(
                    MessagesEnum['server-couldnt-initialize'] + this.port,
                    MessagesEnum['server-port-in-use'],
                    ErrorCodeEnum['RU-007']
                ));
            } else {
                observer.error(error);
            }
        });
    }
    protected initializeSwagger(): void {
        const swaggerProperties = this.serverProperties.swagger;
        const swaggerDoc = readFileSync(swaggerProperties.filePath);
        this.context.use(
            this.serverProperties.path + swaggerProperties.path,
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
        return new Observable<boolean>((observer: Subscriber<boolean>) => {
            this.initializeExpress();
            if (this.isFileServerEnabled())   {
                this.initializeFileServer();
            }
            if (this.isSwaggerEnabled())   {
                this.initializeSwagger();
            }
            this.initializeServer(observer);
        });
    }
    public registerPath(path: string, httpType: HttpType, executor: any): void {
        const finalPath = this.serverProperties.path + path;
        this.context[httpType](finalPath, executor);
    }
}
