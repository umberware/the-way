import { ApplicationException } from "./application.exception";

export class UnauthorizedException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Unauthorized', 401);
    }
}