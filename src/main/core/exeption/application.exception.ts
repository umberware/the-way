
/**
 *   @name ApplicationException
 *   This class will be used when an error occur in the Core
 *   @param detail is the error detail
 *   @param description is the error summary
 *   @since 1.0.0
 */
export class ApplicationException extends Error {
    public message: string;
    public name: string;

    constructor(public detail: string, public description: string, ex?: Error) {
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
}
