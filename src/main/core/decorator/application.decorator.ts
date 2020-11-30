import 'reflect-metadata';

import { CORE } from '../core';
import { TheWayApplication } from '../../core/the-way-application';
import { ApplicationException } from '../exeption/application.exception';
import { ErrorCodeEnum } from '../exeption/error-code.enum';
import { MessagesEnum } from '../model/messages.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export function Application(params?: {custom?: Array<any>; automatic?: boolean}) {
    return (constructor: any): void => {
        const core = CORE.getCoreInstance();

        if (!(constructor.prototype instanceof TheWayApplication)) {
            throw new ApplicationException(
                MessagesEnum['not-the-way'],
                MessagesEnum['internal-error'],
                ErrorCodeEnum['RU-001']);
        }

        if (params?.custom) {
            core.setCustomInstances(params.custom);
        }

        if (!params || params.automatic || params.automatic === undefined) {
            core.buildMain(constructor);
        }
    };
}
