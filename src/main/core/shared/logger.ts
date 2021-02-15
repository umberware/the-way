import { ApplicationException } from '../exeption/application.exception';
import { LogLevelEnum } from './log-level.enum';
import { PropertyModel } from '../model/property.model';

/* eslint-disable no-console */
export class Logger {

    protected logProperties: PropertyModel;

    constructor() {
        this.logProperties = { enabled: true, level: 1, date: true };
    }

    protected buildMessage(prefix: string, message: string): string {
        let final = prefix + ' ';
        if (this.logProperties.date) {
            final += new Date().toISOString() + ' - ';
        }
        return final + message;
    }
    public debug(message: string, prefix = '[DEBUG]'): void {
        if (!this.logProperties.enabled || this.logProperties.level !== LogLevelEnum.FULL) {
            return;
        }
        console.info(this.buildMessage(prefix, message));
    }
    public error(error: Error, prefix = '[Error]', message?: string): void {
        if (!this.logProperties.enabled) {
            return;
        }

        if (message) {
            console.error(this.buildMessage(prefix, message));
        }
        if (error instanceof ApplicationException) {
            console.error(
                this.buildMessage(
                    prefix, error.getCode() + ': ' + error.getDescription() + ' -> ' + error.getDetail()
                )
            );
        } else if (error.stack) {
            console.error(this.buildMessage(prefix, error.stack));
        }
    }
    public getLogLevel(): number {
        return this.logProperties.level as number;
    }
    public info(message: string, prefix = '[INFO]'): void {
        console.info(this.buildMessage(prefix, message));
    }
    public setProperties(properties: PropertyModel) {
        this.logProperties = properties;
    }
    public warn(message: string, prefix = '[WARN]'): void {
        console.warn(this.buildMessage(prefix, message));
    }
}
