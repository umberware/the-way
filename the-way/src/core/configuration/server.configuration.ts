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
  
  public configure(): void {
    this.port = this.propertiesConfiguration.properties['the-way'].server.port;
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
      
    this.server = http.createServer(this.context);
  }
  public start() {
    this.initializeExpress();
    this.server.listen(this.port, () => {
      this.logService.info(`Server started on port ${this.port}`);
    });
  }
}
