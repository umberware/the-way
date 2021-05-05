import { CORE } from '../../core';
import { TheWayApplication } from '../../the-way-application';
import { ApplicationException } from '../../exeption/application.exception';
import { CoreMessageService } from '../../service/core-message.service';

/* eslint-disable @typescript-eslint/ban-types*/
export const ApplicationMetaKey = 'Application';
export const Application = (params?: { automatic?: boolean; }) => {
    return (constructor: Function): void => {
        if (!(constructor.prototype instanceof TheWayApplication)) {
            throw new ApplicationException(
                CoreMessageService.getMessage('error-is-not-the-way'),
                CoreMessageService.getMessage('TW-001')
            );
        }

        if (!params || params.automatic || params.automatic === undefined) {
            CORE.createCore(constructor);
        }
        Reflect.defineMetadata(ApplicationMetaKey, Application, constructor);
    };
};
