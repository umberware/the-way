import { Observable } from 'rxjs';

import { PathParamMetadataKey } from '../../decorator/rest/param/path-param.decorator';
import { TokenUserMetaKey } from '../../decorator/rest/param/requesting-user.decorator';
import { BodyParamMetadataKey } from '../../decorator/rest/param/body-param.decorator';
import { QueryParamMetadataKey } from '../../decorator/rest/param/query-param.decorator';
import { Service } from '../../decorator/service.decorator';
import { ServerConfiguration } from '../../configuration/server.configuration';
import { HttpType } from './http-type.enum';
import { ApplicationException } from '../../exeption/application.exception';
import { LogService } from '../log/log.service';
import { BadRequestException } from '../../exeption/bad-request.exception';
import { InternalException } from '../../exeption/internal.exception';
import { SecurityService } from '../security.service';
import { HeaderMetadataKey } from '../../decorator/rest/param/header.decorator';
import { ResponseMetadataKey } from '../../decorator/rest/param/response.decorator';
import { RequestMetadataKey } from '../../decorator/rest/param/request.decorator';
import { CORE } from '../../core';

@Service()
export class HttpService {
    serverConfiguration: ServerConfiguration;
    securityService: SecurityService;
    logService: LogService;

    constructor() {
        this.serverConfiguration = CORE.getCoreInstance().getInstanceByName<ServerConfiguration>('ServerConfiguration');
        this.securityService = CORE.getCoreInstance().getInstanceByName<SecurityService>('SecurityService');
        this.logService = CORE.getCoreInstance().getInstanceByName<LogService>('LogService');
        this.serverConfiguration.start();
    }

    private buildPathParams(pathParams: Array<any>, req: any, functionArguments: Array<unknown>): void {
        for (const param of pathParams) {
            const paramValue = req.params[param.name];
            if (paramValue) {
                functionArguments[param.index as number] = paramValue;
            } else {
                throw new InternalException('The path variable and the method argument name are differents.');
            }
        }
    }
    private execute(
        httpType: HttpType, authenticated: boolean | undefined, allowedProfiles: Array<unknown> | undefined, 
        target: any, propertyKey: string, req: any, res: any
    ): void {
        try {
            let user: Object | null = null;
            if (authenticated) {
                const token: string = req.headers.authorization;
                user = this.securityService.verifyToken(token, allowedProfiles);
            }
            this.executeMethod(httpType, target, propertyKey, req, res, user).subscribe(
                (response: any) => {
                    if (!res.headersSent) {
                        (res.send as Function)(response);
                    }
                }, (error: Error) => {
                    this.handleError(error, res);
                }
            );
        } catch (error) {
            this.handleError(error, res);
        }
    }
    private executeMethod(httpType: HttpType, target: any, propertyKey: string, req: any, res: any, user: any): Observable<unknown> {
        const method = target[propertyKey];
        const functionArgumentsLength = method.length;
        const functionArguments = new Array<any>().fill(undefined, 0, functionArgumentsLength);
      
        const pathParams: Array<any> = Reflect.getOwnMetadata(PathParamMetadataKey, target, propertyKey);
        const requestUser: number = Reflect.getOwnMetadata(TokenUserMetaKey, target, propertyKey);
        const header: number = Reflect.getOwnMetadata(HeaderMetadataKey, target, propertyKey);
        const response: number = Reflect.getOwnMetadata(ResponseMetadataKey, target, propertyKey);
        const request: number = Reflect.getOwnMetadata(RequestMetadataKey, target, propertyKey);

        if (header !== undefined) {
            functionArguments[header] = req.headers;
        }

        if (response !== undefined) {
            functionArguments[response] = res;
        }

        if (request !== undefined) {
            functionArguments[request] = req;
        }
      
        if (requestUser !== undefined) {
            functionArguments[requestUser] = user;
        }
      
        if (pathParams) {
            this.buildPathParams(pathParams, req, functionArguments);
        }
      
        if (httpType === HttpType.GET || httpType === HttpType.DEL) {
            const queryParam: number = Reflect.getOwnMetadata(QueryParamMetadataKey, target, propertyKey);
            if (queryParam !== undefined && queryParam !== null) {
                functionArguments[queryParam] = req.query;
            }
        } else if (httpType === HttpType.POST || httpType === HttpType.PUT) {
            const bodyParam: number = Reflect.getOwnMetadata(BodyParamMetadataKey, target, propertyKey);
            if (bodyParam !== undefined && bodyParam !== null) {
                if (Object.keys(req.body as Object).length === 0) {
                    throw new BadRequestException('Request is empty');
                }
                functionArguments[bodyParam] = req.body;
            }
        }
        return Reflect.apply(target[propertyKey] as Function, target, functionArguments);
    }
    private handleError(ex: Error, res: any): void {
        if (ex instanceof ApplicationException) {
            (res.status as Function)(ex.getCode()).send(ex);
        } else {
            (res.status as Function)('500').send(ex);
        }
        this.logService.error(ex);
    }
    public registerPath(
        httpType: HttpType, path: string, authenticated: boolean | undefined, 
        allowedProfiles: Array<unknown> | undefined, target: Object, propertyKey: string
    ): void {
        const requestUser: number = Reflect.getOwnMetadata(TokenUserMetaKey, target, propertyKey);

        if (requestUser !== undefined && !authenticated) {
            throw new ApplicationException('To inject the TokenUser you must declare an authenticated path', 'Path not authenticated', 'RU-002');
        }

        this.serverConfiguration.context[httpType](path, (req: Object, res: Object) => {
            this.execute(httpType, authenticated, allowedProfiles, target, propertyKey, req, res);
        });
    }
}
