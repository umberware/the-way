import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as http from 'http';
import * as SwaggerUi from 'swagger-ui-express';
import * as SwaggerDocs from 'swagger-jsdoc';
import { writeFileSync } from 'fs';

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
        this.theWayProperties = this.propertiesConfiguration.properties['the-way']
        this.serverProperties = this.theWayProperties.server;
    }

    public configure(): Observable<boolean> {
        this.port =  this.serverProperties.port as number;
        return this.start();
    }
    public destroy(): Observable<boolean> {
        return new Observable((observer) => {
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
        }
        this.context = express();
        this.context
            .use(cors(corsOptions))
            .use(morgan('dev'))
            .use(bodyParser.json())
            .use(helmet())
            .disable('x-powered-by')
            .use(bodyParser.urlencoded({ extended: false }))
    }
    public initializeFileServer(): void {
        const server = this.theWayProperties.server;
        const fileProperties = server.file as any;
        const dirName = process.cwd();
        const filePath: string = (fileProperties.full) ? fileProperties.path as string : dirName + fileProperties.path as string;
        const assets = fileProperties.assets as any;
        const staticProperty = fileProperties.assets as any;

        if (assets && assets.path !== '') {
            const assetsPath: string = (assets.full) ? assets.path as string: filePath + assets.path as string;
            this.context.use('/assets', express.static(assetsPath));
        } 

        if (staticProperty && staticProperty.path !== '') {
            const staticPath = (staticProperty.full) ? staticProperty.path as string : filePath + staticProperty.path as string;
            this.context.use('/static', express.static(staticPath));
        }
        this.context.get('/*', (req: any, res: any, next: Function) => {
            if (req.path === '/' || (fileProperties.fallback && !(req.path as string).includes(server['api-endpoint'] as string))) {
                (res.sendFile as Function)(filePath + '/index.html');
            } else {
                next();
            }
        });
    }
    private initializeServer(observer: Subscriber<boolean>): void {
        this.server = http.createServer(this.context);
        this.server.listen(this.port, () => {
            this.logService.info(`Server started on port ${this.port}`);
            observer.next(true);
        });
        this.server.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                observer.error(new ApplicationException(MessagesEnum['server-couldnt-initialize'] + this.port, MessagesEnum['server-port-in-use'], ErrorCodeEnum['RU-007']));
            } else {
                observer.error(error);
            }
        })
    }
    private initializeSwagger(): void {
        const swaggerProperties = this.serverProperties.swagger;
        const swaggerOptions: any = {
            swaggerDefinition: {
                info: {
                    version: swaggerProperties.version,
                    title: swaggerProperties.title,
                    description: swaggerProperties.description,
                    contact: swaggerProperties.contact
                }
            },
            apis: [swaggerProperties.filesMatcher]
        }
        if (swaggerProperties.type) {
            swaggerOptions.swaggerDefinition[swaggerProperties.type.name] = swaggerProperties.type.version
        }

        const swaggerDocs = SwaggerDocs(swaggerOptions);
        writeFileSync(swaggerProperties.outputPath, JSON.stringify(swaggerDocs));
        this.context.use(this.serverProperties.path + swaggerProperties.path, SwaggerUi.serve, SwaggerUi.setup(swaggerDocs));
    }
    private isFileServerEnabled(): boolean {
        return this.serverProperties.file && this.serverProperties.file.enabled
    }
    private isSwaggerEnabled(): boolean {
        return this.serverProperties.swagger && this.serverProperties.swagger.enabled
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
    public registerPath(path: string, httpType: HttpType, executor: Function): void {
        const finalPath = this.serverProperties.path + path;
        this.context[httpType](finalPath, executor);
    }
}
