import 'reflect-metadata';

import { CORE } from '../core';
import { TheWayApplication } from '../../core/the-way-application';
import { ApplicationException } from '../exeption/application.exception';
import { ErrorCodeEnum } from '../model/error-code.enum';

export function Application(params?: {custom?: Array<any>; automatic?: boolean}) {
    return (constructor: Function): void => {
        const core = CORE.getCoreInstance();

        if (!(constructor.prototype instanceof TheWayApplication)) {
            throw new ApplicationException('Your @Application class must extends the TheWayApplication', 'Application Error', ErrorCodeEnum['RU-001'])
        }

        if (params?.custom) {
            core.setCustomInstances(params.custom);
        }

        if (!params || params.automatic || params.automatic === undefined) {
            core.buildMain(constructor);
        }
    }
}
