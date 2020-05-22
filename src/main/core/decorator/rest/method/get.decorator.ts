import { CORE } from '../../../core';
import { HttpService } from '../../../service/http/http.service';
import { ApplicationException } from '../../../exeption/application.exception';
import { HttpType } from '../../../service/http/http-type.enum';

export function Get(path: string, authenticated?: boolean, allowedProfiles?: Array<any>) {
    return function (target:  any, propertyKey: string): void {
        CORE.getCoreInstance().ready$.subscribe((ready: boolean) => {
            if (ready) {
                const httpService = CORE.getCoreInstance().getInstanceByName('HttpService') as HttpService;
                if (!httpService) {
                    throw new ApplicationException(
                        'If you want to use the HttpService and the rest decorators, ' + 
                        'you should pass HttpService or and extended class of HttpService on Application decorator',
                        'HttpService not found', 'RU-001');
                } else {
                    httpService.registerPath(HttpType.GET, path, authenticated, allowedProfiles, target, propertyKey);
                }
            }
        })
    }
}