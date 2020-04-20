import { ApplicationException } from '../../exeption/application.exception';
import { LogLevel } from './log-level.enum';

export class LogService {
    
    level: LogLevel;
    
    constructor() {
        this.level = LogLevel.FULL;
    }

    public error(error: Error): void {
        if (error instanceof ApplicationException) {
            console.error(
                '[Error] ' + error.getCode() + ' ' + error.getDetail() + ' '
                + error.getDescription()
            );
        } else {
            console.error('[Error] ' + error.stack);
        }
    }
    public info(message: string): void {
        console.info('[INFO] ' + message);
    }
    public debug(message: string): void {
        if (this.level === LogLevel.FULL) {
            console.info('[DEBUG] ' + message);
        }
    }
}
