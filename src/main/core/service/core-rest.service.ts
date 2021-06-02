import { isObservable, Observable, of } from 'rxjs';
import { defaultIfEmpty, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import { Inject } from '../decorator/core/inject.decorator';
import { Service } from '../decorator/core/service.decorator';
import { CoreLogger } from './core-logger';
import { ServerConfiguration } from '../configuration/server.configuration';
import { HttpTypeEnum } from '../shared/enum/http-type.enum';
import { InternalException } from '../exeption/internal.exception';
import { CoreMessageService } from './core-message.service';
import { ApplicationException } from '../exeption/application.exception';
import { RestException } from '../exeption/rest.exception';
import { ClaimsMetaKey } from '../decorator/rest/param/claims.decorator';
import { CORE } from '../core';
import { TokenClaims } from '../shared/model/token-claims.model';
import { System } from '../decorator/core/system.decorator';
import { PathParamMetadataKey } from '../decorator/rest/param/path-param.decorator';
import { QueryParamMetadataKey } from '../decorator/rest/param/query-param.decorator';
import { ResponseMetadataKey } from '../decorator/rest/param/response.decorator';
import { HeaderMetadataKey } from '../decorator/rest/param/header.decorator';
import { RequestMetadataKey } from '../decorator/rest/param/request.decorator';
import { BodyParamMetadataKey } from '../decorator/rest/param/body-param.decorator';
import { BadRequestException } from '../exeption/bad-request.exception';
import { CoreSecurityService } from './core-security.service';
import { PathMapModel } from '../shared/model/path-map.model';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
@System
@Service()
export class CoreRestService {
    @Inject logService: CoreLogger;
    @Inject serverConfiguration: ServerConfiguration;
    @Inject securityService: CoreSecurityService;

    protected buildPathParams(pathParams: Array<any>, req: any, functionArguments: Array<unknown>): void {
        for (const param of pathParams) {
            const paramValue = req.params[param.name];
            if (paramValue) {
                functionArguments[param.index] = paramValue;
            } else {
                throw new InternalException(CoreMessageService.getMessage('error-rest-path-parameter', [param.name]));
            }
        }
    }
    protected buildObservableFromResponse(result: any): Observable<any> {
        let executionResultObservable;
        if (isObservable(result)) {
            executionResultObservable = result;
        } else if (result instanceof Promise) {
            executionResultObservable = fromPromise(result);
        } else if (result) {
            executionResultObservable = of(result);
        } else {
            executionResultObservable = of(undefined);
        }
        return executionResultObservable.pipe(
            defaultIfEmpty()
        );
    }
    protected execute(
        httpType: HttpTypeEnum, target: any, propertyKey: string, req: any, res: any,
        fatherPath: PathMapModel, authenticated?: boolean, allowedProfiles?: Array<any>
    ): void {
        try {
            const token = req.headers.authorization as string;
            this.verifyToken(fatherPath, token, allowedProfiles, authenticated).pipe(
                switchMap((tokenClaims: TokenClaims | undefined) => {
                    return this.executeMethod(httpType, target, propertyKey, req, res, tokenClaims);
                })
            ).subscribe(
                (response: any) => {
                    if (!res.headersSent && response) {
                        res.send(response);
                    }
                }, (error: Error) => {
                    this.handleError(error, res);
                }, () => {
                    if (!res.headersSent) {
                        res.status(500).send(new InternalException(
                            CoreMessageService.getMessage('error-rest-empty-response')
                        ));
                    }
                }
            );
        } catch (error) {
            this.handleError(error, res);
        }
    }
    protected executeMethod(
        httpType: HttpTypeEnum, target: any, propertyKey: string, req: any,
        res: any, tokenClaims?: TokenClaims
    ): Observable<unknown> {
        const method = target[propertyKey];
        const functionArgumentsLength = method.length;
        const functionArguments = new Array<any>().fill(undefined, 0, functionArgumentsLength);
        const pathParams: Array<any> = Reflect.getOwnMetadata(PathParamMetadataKey, target, propertyKey);
        const tokenClaimsIndex: number = Reflect.getOwnMetadata(ClaimsMetaKey, target, propertyKey);
        const headerIndex: number = Reflect.getOwnMetadata(HeaderMetadataKey, target, propertyKey);
        const responseIndex: number = Reflect.getOwnMetadata(ResponseMetadataKey, target, propertyKey);
        const requestIndex: number = Reflect.getOwnMetadata(RequestMetadataKey, target, propertyKey);

        if (headerIndex !== undefined) {
            functionArguments[headerIndex] = req.headers;
        }
        if (responseIndex !== undefined) {
            functionArguments[responseIndex] = res;
        }
        if (requestIndex !== undefined) {
            functionArguments[requestIndex] = req;
        }

        if (tokenClaimsIndex !== undefined) {
            functionArguments[tokenClaimsIndex] = tokenClaims;
        }
        if (pathParams) {
            this.buildPathParams(pathParams, req, functionArguments);
        }

        // Todo: Verify if post, put, patch can have query params and body.
        if (httpType === HttpTypeEnum.GET || httpType === HttpTypeEnum.DELETE || httpType === HttpTypeEnum.HEAD) {
            const queryParam: number = Reflect.getOwnMetadata(QueryParamMetadataKey, target, propertyKey);
            if (queryParam !== undefined && queryParam !== null) {
                functionArguments[queryParam] = req.query;
            }
        } else {
            const bodyParam: number = Reflect.getOwnMetadata(BodyParamMetadataKey, target, propertyKey);
            if (bodyParam !== undefined && bodyParam !== null) {
                if (Object.keys(req.body).length === 0) {
                    throw new BadRequestException(CoreMessageService.getMessage('error-rest-empty-request'));
                }
                functionArguments[bodyParam] = req.body;
            }
        }
        const instance = CORE.getInstanceByName(target.constructor.name);
        const executionResult = Reflect.apply(target[propertyKey], instance, functionArguments);
        return this.buildObservableFromResponse(executionResult);
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
        httpType: HttpTypeEnum, path: string, target: any, propertyKey: string,
        fatherPath: PathMapModel, authenticated?: boolean, allowedProfiles?: Array<any>
    ): void {
        const claims: number = Reflect.getOwnMetadata(ClaimsMetaKey, target, propertyKey);

        if (claims !== undefined && !authenticated) {
            throw new ApplicationException(
                CoreMessageService.getMessage('error-rest-claims-without-token-verify'),
                CoreMessageService.getMessage('TW-011')
            );
        }
        this.serverConfiguration.registerPath(path, httpType,  (req: Request, res: Response) => {
            this.execute(httpType, target, propertyKey, req, res, fatherPath, authenticated, allowedProfiles);
        });
    }
    protected verifyToken(
        fatherPath: PathMapModel, token?: string,
        profiles?: Array<any>, authenticated?: boolean
    ): Observable<TokenClaims | undefined> {
        if (!authenticated && !fatherPath.isAuthenticated) {
            return of(undefined);
        } else {
            const verificationResult = this.securityService.verifyToken(
                fatherPath, token, profiles
            );
            return this.buildObservableFromResponse(verificationResult);
        }
    }
}
