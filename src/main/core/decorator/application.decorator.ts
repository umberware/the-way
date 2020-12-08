import 'reflect-metadata';

import { CORE } from '../core';
import { TheWayApplication } from '../../core/the-way-application';
import { ApplicationException } from '../exeption/application.exception';
import { ErrorCodeEnum } from '../exeption/error-code.enum';
import { MessagesEnum } from '../model/messages.enum';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export function Application(params?: {automatic?: boolean}) {
    return (constructor: any): void => {
        if (!(constructor.prototype instanceof TheWayApplication)) {
            throw new ApplicationException(
                MessagesEnum['not-the-way'],
                MessagesEnum['internal-error'],
                ErrorCodeEnum['RU-001']);
        }

        const core = new CORE();

        if (!params || params.automatic || params.automatic === undefined) {
            core.execute(constructor);
        }
    };
}
