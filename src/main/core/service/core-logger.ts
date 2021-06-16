import { ApplicationException } from '../exeption/application.exception';
import { LogLevelEnum } from '../shared/enum/log-level.enum';
import { PropertyModel } from '../shared/model/property.model';

/* eslint-disable no-console */
/**
 * @class CoreLogger
 * @description This class is used to log information.
 *  Some behaviors can be changed with the the-way.core.log properties
 * @since 1.0.0
* */
export class CoreLogger {

    protected logProperties: PropertyModel;

    constructor() {
        this.logProperties = { level: 1, date: true };
    }

    protected buildMessage(prefix: string, message: string): string {
        let final = prefix + ' ';
        if (this.logProperties.date) {
            final += new Date().toISOString() + ' - ';
        }
        return final + message;
    }
    /**
     * @method debug
     * @description This method will log information as debug type
     *  When the loglevel is not Full, the "debug" logs will not be displayed
     * @param message is the message to show
     * @param prefix if not provided, the message will be prefixed with '[DEBUG]'
     * @since 1.0.0
     * */
    public debug(message: string, prefix = '[DEBUG]'): void {
        if (this.logProperties.level !== LogLevelEnum.FULL) {
            return;
        }
        console.info(this.buildMessage(prefix, message));
    }
    /**
     * @method error
     * @description This method will log information as Error type
     * @param error is the error to be logged. Can be an instance of ApplicationException or an Error
     * @param prefix if not provided, the message will be prefixed with '[ERROR]'
     * @param message if want to log a message with the error, you can use this parameter
     * @since 1.0.0
     * */
    public error(error: Error, prefix = '[ERROR]', message?: string): void {
        if (message) {
            console.error(this.buildMessage(prefix, message));
        }
        if (error instanceof ApplicationException) {
            const message = error.getDescription() + ' -> ' + error.getDetail();
            console.error(
                this.buildMessage(prefix, message)
            );

        }
        if (error.stack) {
            console.error(this.buildMessage(prefix, error.stack));
        }
    }
    /**
     * @method getLogLevel
     * @description Retrieves the actual log level
     * @return The actual logLevel
     * @since 1.0.0
     * */
    public getLogLevel(): number {
        return this.logProperties.level as number;
    }
    /**
     * @method info
     * @description This method will log information as Info type
     * @param message is the message to be logged
     * @param prefix if not provided, the message will be prefixed with '[INFO]'
     * @since 1.0.0
     * */
    public info(message: string, prefix = '[INFO]'): void {
        console.info(this.buildMessage(prefix, message));
    }
    /**
     * @method setProperties
     * @description This method will set the local the-way.core.log properties
     * @param properties is a PropertyModel object to be defined as the-way.core.log properties
     * @since 1.0.0
     * */
    public setProperties(properties: PropertyModel): void {
        this.logProperties = properties;
    }
    /**
     * @method warn
     * @description This method will log information as Warn type
     * @param message is the message to be logged
     * @param prefix if not provided, the message will be prefixed with '[WARN]'
     * @since 1.0.0
     * */
    public warn(message: string, prefix = '[WARN]'): void {
        console.warn(this.buildMessage(prefix, message));
    }
}
