import { ApplicationException } from '../../exeption/application.exception';
import { LogLevel } from './log-level.enum';
import { Service } from '../../decorator/service.decorator';
import { CORE, PropertiesConfiguration } from '../../..';

/* eslint-disable  @typescript-eslint/no-explicit-any */
@Service()
export class LogService {

    protected logProperties: any;

    constructor() {
        const core = CORE.getCoreInstance();
        const propertiesConfiguration = core.getInstanceByName<PropertiesConfiguration>('PropertiesConfiguration');
        this.logProperties = propertiesConfiguration.properties['the-way']['core']['log'];
    }

    public error(error: Error): void {
        if (!this.logProperties.enabled) {
            return;
        }

        if (error instanceof ApplicationException) {
            console.error(
                '[Error] ' + new Date().toUTCString() + ' - ' + error.getCode() + ' ' + error.getDetail() + ' '
                + error.getDescription()
            );
        } else {
            console.error('[Error] ' + new Date().toUTCString() + ' - ' + error.stack);
        }
    }
    public info(message: string): void {
        console.info('[INFO] ' + new Date().toUTCString() + ' - ' + message);
    }
    public warn(message: string): void {
        console.warn('[INFO] ' + new Date().toUTCString() + ' - ' + message);
    }
    public debug(message: string): void {
        if (!this.logProperties.enabled || this.logProperties.level !== LogLevel.FULL) {
            return;
        }
        console.info('[DEBUG] ' + new Date().toUTCString() + ' - ' + message);
    }
}
