import { Logger } from '../shared/logger';
import { CORE } from '../core';
import { HttpType } from '../service/http/http-type.enum';
import { HttpService } from '../service/http/http.service';
import { MessagesEnum } from '../model/messages.enum';
import { ErrorCodeEnum } from '../exeption/error-code.enum';
import { PropertiesConfiguration } from '../configuration/properties.configuration';
import { InstanceHandler } from './instance.handler';

export class RestHandler {
    constructor(
        protected core: CORE, protected logger: Logger,
        protected propertiesConfiguration: PropertiesConfiguration,
        protected instanceHandler: InstanceHandler
    ) {
    }

    /*eslint-disable @typescript-eslint/explicit-module-boundary-types*/
    public registerPath(
        httpType: HttpType, path: string, authenticated: boolean | undefined,
        allowedProfiles: Array<any> | undefined, target: any, propertyKey: string
    ): void {
        if (this.propertiesConfiguration.properties.server.enabled) {
            const httpService = this.instanceHandler.getInstanceByName('HttpService') as HttpService;
            httpService.registerPath(httpType, path, authenticated, allowedProfiles, target, propertyKey);
        } else {
            console.error(MessagesEnum['no-http-service'], MessagesEnum['not-found'], ErrorCodeEnum['RU-002']);
            this.core.destroy();
        }
    }
}
