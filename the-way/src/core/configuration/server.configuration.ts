import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as http from 'http';

import { LogService } from '../service/log/log.service';
import { AbstractConfiguration } from './abstract.configuration';
import { Inject } from '../decorator/inject.decorator';
import { Configuration } from '../decorator/configuration.decorator';
import { PropertiesConfiguration } from './properties.configuration';

@Configuration()
export class ServerConfiguration extends AbstractConfiguration {
  @Inject() logService: LogService;
  @Inject() propertiesConfiguration: PropertiesConfiguration;

  public context: any;
  public server: http.Server;
  public port: number;
  protected theWayProperties: any
  
  public configure(): void {
    this.theWayProperties = this.propertiesConfiguration.properties['the-way'];
    this.port = this.theWayProperties.server.port;
  }
  private initializeExpress(): void {
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

    if (this.theWayProperties.server.file.enabled)   {
      this.initializeFileServer();
    }
    
    this.server = http.createServer(this.context);
  }
  public initializeFileServer(): void {
    const server = this.theWayProperties.server;
    const fileProperties = server.file;
    const dirName = process.cwd();
    let filePath: string = (fileProperties.full) ? fileProperties.path : dirName + fileProperties.path;

    if (fileProperties.assets && fileProperties.assets.path !== '') {
      const assetsPath = (fileProperties.assets.full) ? fileProperties.assets.path : filePath + fileProperties.assets.path;
      this.context.use('/assets', express.static(assetsPath));
    } 

    if (fileProperties.static && fileProperties.static.path !== '') {
      const staticPath = (fileProperties.static.full) ? fileProperties.static.path : filePath + fileProperties.static.path;
      this.context.use('/static', express.static(staticPath));
    }
    this.context.get('/*', (req: any, res: any, next: Function) => {
      if (req.path === '/' || (fileProperties.fallback && !req.path.includes(server['api-endpoint']))) {
        res.sendFile(filePath + '/index.html');
      } else {
        next();
      }
    });
  }
  public start() {
    this.initializeExpress();
    this.server.listen(this.port, () => {
      this.logService.info(`Server started on port ${this.port}`);
    });
  }
}
