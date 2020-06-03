import { CORE } from '../../../core';
import { HttpService } from '../../../service/http/http.service';
import { ApplicationException } from '../../../exeption/application.exception';
import { HttpType } from '../../../service/http/http-type.enum';
import { ErrorCodeEnum } from '../../../exeption/error-code.enum';
import { MessagesEnum } from '../../../model/messages.enum';

export const Get = function (path: string, authenticated?: boolean, allowedProfiles?: Array<any>) {  
    return (target:  any, propertyKey: string, descriptor: any): any => {
        CORE.ready$.subscribe((ready: boolean) => {
            if (ready) {
                const httpService = CORE.getCoreInstance().getInstanceByName('HttpService') as HttpService;
                if (!httpService) {
                    throw new ApplicationException(MessagesEnum['no-http-service'], MessagesEnum['not-found'], ErrorCodeEnum['RU-002']);
                } else {
                    httpService.registerPath(HttpType.GET, path, authenticated, allowedProfiles, target, propertyKey);
                }
            }
        })
        return descriptor;
    }
}