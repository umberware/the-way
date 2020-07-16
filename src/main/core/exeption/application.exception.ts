import { ErrorCodeEnum } from './error-code.enum';

export class ApplicationException implements Error {
    public message: string;
    public name: string;

    constructor(public detail: string, public description: string, public code: ErrorCodeEnum) {
        this.message = detail + ' -> ' + description;
    }

    public getDetail(): string {
        return this.detail;
    }
    public getDescription(): string {
        return this.description;
    }
    public getCode(): string | number {
        return this.code;
    }
}
