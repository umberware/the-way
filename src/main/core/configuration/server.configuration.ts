import { System } from '../decorator/system.decorator';
import { Configuration }  from '../decorator/configuration.decorator';

@System
@Configuration()
export class ServerConfiguration {}
