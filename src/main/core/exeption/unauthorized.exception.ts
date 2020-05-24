import { ApplicationException } from "./application.exception";
import { ErrorCodeEnum } from "../model/error-code.enum";

export class UnauthorizedException extends ApplicationException {
    constructor(message: string) {
        super(message, 'Unauthorized', ErrorCodeEnum.UNAUTHORIZED);
    }
}