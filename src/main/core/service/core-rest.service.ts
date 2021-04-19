import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

import { Inject } from '../decorator/inject.decorator';
import { Service } from '../decorator/service.decorator';
import { Logger } from '../shared/logger';
import { ServerConfiguration } from '../configuration/server.configuration';
import { HttpType } from '../enum/http-type.enum';
import { InternalException } from '../exeption/internal.exception';
import { Messages } from '../shared/messages';
import { ApplicationException } from '../exeption/application.exception';
import { RestException } from '../exeption/rest.exception';
import { ClaimsMetaKey } from '../decorator/rest/param/claims.decorator';
import { CORE } from '../core';
import { TokenClaims } from '../model/token-claims.model';
import { System } from '../decorator/system.decorator';
import { PathParamMetadataKey } from '../decorator/rest/param/path-param.decorator';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
@System
@Service()
export class CoreRestService {
    @Inject logService: Logger;
    @Inject serverConfiguration: ServerConfiguration;
    // securityService: SecurityService;

    protected buildPathParams(pathParams: Array<any>, req: any, functionArguments: Array<unknown>): void {
        for (const param of pathParams) {
            const paramValue = req.params[param.name];
            if (paramValue) {
                functionArguments[param.index] = paramValue;
            } else {
                throw new InternalException(Messages.getMessage('error-rest-path-parameter', [param.name]));
            }
        }
    }
    protected execute(
        httpType: HttpType, authenticated: boolean | undefined, allowedProfiles: Array<any> | undefined,
        target: any, propertyKey: string,  req: any, res: any
    ): void {
        try {

            // this.securityService.verifyToken(req.headers.authorization, allowedProfiles, authenticated).pipe(
            //     switchMap((tokenClaims: TokenClaims | undefined) => {
            this.executeMethod(httpType, target, propertyKey, req, res).subscribe(
                (response: any) => {
                    if (!res.headersSent) {
                        res.send(response);
                    }
                }, (error: Error) => {
                    this.handleError(error, res);
                }
            );
        } catch (error) {
            this.handleError(error, res);
        }
    }
    protected executeMethod(
        httpType: HttpType, target: any, propertyKey: string, req: any,
        res: any, tokenClaims?: TokenClaims
    ): Observable<unknown> {
        const method = target[propertyKey];
        const functionArgumentsLength = method.length;
        const functionArguments = new Array<any>().fill(undefined, 0, functionArgumentsLength);

        const pathParams: Array<any> = Reflect.getOwnMetadata(PathParamMetadataKey, target, propertyKey);
        // const tokenClaimsIndex: number = Reflect.getOwnMetadata(ClaimsMetaKey, target, propertyKey);
        // const headerIndex: number = Reflect.getOwnMetadata(HeaderMetadataKey, target, propertyKey);
        // const responseIndex: number = Reflect.getOwnMetadata(ResponseMetadataKey, target, propertyKey);
        // const requestIndex: number = Reflect.getOwnMetadata(RequestMetadataKey, target, propertyKey);
        //
        // if (headerIndex !== undefined) {
        //     functionArguments[headerIndex] = req.headers;
        // }
        //
        // if (responseIndex !== undefined) {
        //     functionArguments[responseIndex] = res;
        // }
        //
        // if (requestIndex !== undefined) {
        //     functionArguments[requestIndex] = req;
        // }
        //
        // if (tokenClaimsIndex !== undefined) {
        //     functionArguments[tokenClaimsIndex] = tokenClaims;
        // }
        //
        if (pathParams) {
            this.buildPathParams(pathParams, req, functionArguments);
        }

        // // Todo: Verify if post, put, patch can have query params and body.
        // if (httpType === HttpType.GET || httpType === HttpType.DELETE || httpType === HttpType.HEAD) {
        //     const queryParam: number = Reflect.getOwnMetadata(QueryParamMetadataKey, target, propertyKey);
        //     if (queryParam !== undefined && queryParam !== null) {
        //         functionArguments[queryParam] = req.query;
        //     }
        // } else {
        //     const bodyParam: number = Reflect.getOwnMetadata(BodyParamMetadataKey, target, propertyKey);
        //     if (bodyParam !== undefined && bodyParam !== null) {
        //         if (Object.keys(req.body).length === 0) {
        //             throw new BadRequestException(MessagesEnum['rest-empty-request']);
        //         }
        //         functionArguments[bodyParam] = req.body;
        //     }
        // }
        const instance = CORE.getInstanceByName(target.constructor.name);
        const executionResult = Reflect.apply(target[propertyKey], instance, functionArguments);

        if (executionResult instanceof Promise) {
            return fromPromise(executionResult);
        } else if (executionResult instanceof Observable) {
            return executionResult;
        } else {
            return of(executionResult);
        }
    }
    protected handleError(ex: Error, res: any): void {
        if (ex instanceof RestException) {
            res.status(ex.code).send(ex);
        } else {
            res.status(500).send({ message: ex.message });
        }
        this.logService.error(ex);
    }
    public registerPath(
        httpType: HttpType, path: string, target: any, propertyKey: string,
        authenticated?: boolean, allowedProfiles?: Array<any>
    ): void {
        const claims: number = Reflect.getOwnMetadata(ClaimsMetaKey, target, propertyKey);

        if (claims !== undefined && !authenticated) {
            throw new ApplicationException(
                Messages.getMessage('error-rest-claims-without-token-verify'),
                Messages.getMessage('TW-011')
            );
        }
        this.serverConfiguration.registerPath(path, httpType,  (req: any, res: any) => {
            this.execute(httpType, authenticated, allowedProfiles, target, propertyKey, req, res);
        });
    }
}
