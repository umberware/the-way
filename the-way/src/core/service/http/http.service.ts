import { Observable } from 'rxjs';

import { Inject } from '../../decorator/inject.decorator';
import { PathParamMetadataKey } from '../../decorator/rest/param/path-param.decorator';
import { RequestingUserMetaKey } from '../../decorator/rest/param/requesting-user.decorator';
import { BodyParamMetadataKey } from '../../decorator/rest/param/body-param.decorator';
import { QueryParamMetadataKey } from '../../decorator/rest/param/query-param.decorator';
import { Service } from '../../decorator/service.decorator';

import { SecurityService } from '../security.service';
import { ServerConfiguration } from '../../configuration/server.configuration';
import { HttpType } from './http-type.enum';
import { ApplicationException } from '../../exeption/application.exception';
import { LogService } from '../log/log.service';
import { BadRequestException } from '../../exeption/bad-request.exception';
import { InternalException } from '../../exeption/internal.exception';
import { CORE } from '../../core';

@Service()
export class HttpService {
    @Inject() serverConfiguration: ServerConfiguration;
    @Inject() logService: LogService;

    private buildPathParams(pathParams: Array<any>, req: any, functionArguments: any): void {
        for (let param of pathParams) {
            const paramValue = req.params[param.name];
            if (paramValue) {
              functionArguments[param.index] = paramValue;
            } else {
              throw new InternalException('The path variable and the method argument name are differents.');
            }
        }
    }
    private execute(
        httpType: HttpType, path: string, authenticated: boolean, allowedProfiles: Array<any>, 
        target: any, propertyKey: any, descriptor: any, req: any, res: any
    ): void {
        try {
            const securityService = CORE.getInstance().getInjectableByName('SecurityService') as SecurityService;
            let user: any;
            if (authenticated) {
                const token = req.headers.authorization;
                user = securityService.verifyToken(token, allowedProfiles);
            }
            this.executeMethod(httpType, target, propertyKey, req, user).subscribe(
                (response: any) => {
                    res.send(response);
                }, (error: Error) => {
                    this.handleError(error, res);
                }
            );
        } catch (error) {
            this.handleError(error, res);
        }
    }
    private executeMethod(httpType: HttpType, target: any, propertyKey: any, req: any, user: any): Observable<any> {
        const method = target[propertyKey] as Function;
        const functionArgumentsLength = method.length;
        const functionArguments = [].fill(undefined, 0, functionArgumentsLength);
      
        let pathParams: Array<any> = Reflect.getOwnMetadata(PathParamMetadataKey, target, propertyKey);
        let requestUser: any = Reflect.getOwnMetadata(RequestingUserMetaKey, target, propertyKey);
      
        if (requestUser) {
          functionArguments[requestUser] = user;
        }
      
        if (pathParams) {
           this.buildPathParams(pathParams, req, functionArguments);
        }
      
        if (httpType === HttpType.GET || httpType === HttpType.DEL) {
          let queryParam: any = Reflect.getOwnMetadata(QueryParamMetadataKey, target, propertyKey);
          if (queryParam != null) {
            functionArguments[queryParam] = req.query;
          }
        } else if (httpType === HttpType.POST || httpType === HttpType.PUT) {
          let bodyParam: any = Reflect.getOwnMetadata(BodyParamMetadataKey, target, propertyKey);
          if (bodyParam != null) {
            if (Object.keys(req.body).length === 0) {
                throw new BadRequestException('Request is empty');
            }
            functionArguments[bodyParam] = req.body;
          }
        }
        return Reflect.apply(target[propertyKey], target, functionArguments);
    }
    private handleError(ex: Error, res: any): void {
        if (ex instanceof ApplicationException) {
            res.status(ex.getCode()).send(ex);
        } else {
            res.status('500').send(ex);
        }
        this.logService.error(ex);
    }
    public registerPath(
        httpType: HttpType, path: string, authenticated: boolean, 
        allowedProfiles: Array<any>, target: any, propertyKey: any, descriptor: any
    ): void {
        this.serverConfiguration.context[httpType](path, (req: any, res: any) => {
           this.execute(httpType, path, authenticated, allowedProfiles, target, propertyKey, descriptor, req, res);
        });
    }
}
