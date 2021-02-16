export class ApplicationException extends Error {
    public message: string;
    public name: string;

    constructor(public detail: string, public description: string, public code: string | number, ex?: Error) {
        super();
        if (ex) {
            this.stack = ex.stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
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
