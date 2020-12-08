import { ApplicationException } from '../exeption/application.exception';
import { LogLevel } from '../model/log-level.enum';

/* eslint-disable  @typescript-eslint/no-explicit-any, no-console */
export class Logger {

    // Todo achar uma forma de popular o CORE conforme o contexto do injetavél
    // const core = CORE.getCoreInstances();
    // const propertiesConfiguration = core.getInstanceByName<PropertiesConfiguration>('PropertiesConfiguration');
    // @Inject() core: CORE;

    protected logProperties: any;

    constructor() {
        this.logProperties = { enabled: true, level: 1 };
    }

    public error(error: Error, prefix = '[Error]'): void {
        if (!this.logProperties.enabled) {
            return;
        }

        if (error instanceof ApplicationException) {
            console.error(
                prefix + new Date().toUTCString() + ' - ' + error.getCode() + ' ' + error.getDetail() + ' '
                + error.getDescription()
            );
        } else {
            console.error('[Error] ' + new Date().toUTCString() + ' - ' + error.stack);
        }
    }
    public errorWithMessage(message: string, error: Error, prefix = '[Error]'): void {
        if (!this.logProperties.enabled) {
            return;
        }
        if (error instanceof ApplicationException) {
            console.error(
                prefix + ' ' + new Date().toUTCString() + ' - ' + error.getCode() + ' ' + error.getDetail() + ' '
                + error.getDescription()
            );
        } else {
            console.error('[Error] ' + new Date().toUTCString() + ' - ' + error.stack);
        }
    }
    public info(message: string, prefix = '[INFO]'): void {
        console.info(prefix + ' ' + new Date().toUTCString() + ' - ' + message);
    }
    public warn(message: string, prefix = '[WARN]'): void {
        console.warn(prefix + ' ' + new Date().toUTCString() + ' - ' + message);
    }
    public debug(message: string, prefix = '[DEBUG]'): void {
        if (!this.logProperties.enabled || this.logProperties.level !== LogLevel.FULL) {
            return;
        }
        console.info(prefix + ' ' + new Date().toUTCString() + ' - ' + message);
    }
}
