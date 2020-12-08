import 'reflect-metadata';

import { CORE } from '../core';
import { TheWayApplication } from '../../core/the-way-application';
import { ApplicationException } from '../exeption/application.exception';
import { ErrorCodeEnum } from '../exeption/error-code.enum';
import { Messages } from '../model/messages';

/* eslint-disable @typescript-eslint/ban-types*/
export const Application = (params?: { automatic?: boolean; }) => {
    return (constructor: Function): void => {
        if (!(constructor.prototype instanceof TheWayApplication)) {
            throw new ApplicationException(
                Messages['not-the-way'],
                Messages['internal-error'],
                ErrorCodeEnum['RU-001']
            );
        }

        const core = new CORE();

        if (!params || params.automatic || params.automatic === undefined) {
            core.initialize(constructor);
        }
    };
};
