import { ApplicationException } from '../../exeption/application.exception';
import { LogLevel } from './log-level.enum';

export class LogService {
    
    protected level: LogLevel;

    public error(error: Error): void {
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
    public debug(message: string): void {
        if (this.level != undefined && this.level != null && this.level === LogLevel.FULL) {
            console.info('[DEBUG] ' + new Date().toUTCString() + ' - ' + message);
        }
    }

    public setLogLevel(level: LogLevel): void {
        this.level = level;
    }
}
