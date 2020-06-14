import { CORE } from '../../../core';
import { ApplicationException } from '../../../exeption/application.exception';
import { HttpType } from '../../../service/http/http-type.enum';
import { HttpService } from '../../../service/http/http.service';
import { ErrorCodeEnum } from '../../../exeption/error-code.enum';
import { MessagesEnum } from '../../../model/messages.enum';

export const Delete = (path: string, authenticated?: boolean, allowedProfiles?: Array<any>) => {
    return (target:  any, propertyKey: string): void => {
        const core: CORE = CORE.getCoreInstance();
        core.whenReady().subscribe((ready: boolean) => {
            if (ready) {
                const httpService = CORE.getCoreInstance().getInstanceByName('HttpService') as HttpService;
                if (!httpService) {
                    throw new ApplicationException(
                        MessagesEnum['no-http-service'], MessagesEnum['not-found'], ErrorCodeEnum['RU-002']);
                } else {
                    httpService.registerPath(HttpType.DELETE, path, authenticated, allowedProfiles, target, propertyKey);
                }
            }
        })
    }
}