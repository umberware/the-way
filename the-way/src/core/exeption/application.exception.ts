export class ApplicationException implements Error {
    public message: string;
    public name: string;
    
    constructor(private detail: string, private description: string, private code: any) {
        this.message = detail + ' -> ' + description;
    }

    public getDetail(): string {
        return this.detail;
    }
    public getDescription(): string {
        return this.description;
    }
    public getCode(): number {
        return this.code;
    }
}
