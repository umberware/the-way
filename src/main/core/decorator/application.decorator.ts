import { CORE } from '../core';
import { TheWayApplication } from '../../core/the-way-application';
import { ApplicationException } from '../exeption/application.exception';
import { Messages } from '../shared/messages';

/* eslint-disable @typescript-eslint/ban-types*/
export const Application = (params?: { automatic?: boolean; }) => {
    return (constructor: Function): void => {
        if (!(constructor.prototype instanceof TheWayApplication)) {
            throw new ApplicationException(
                Messages.getMessage('is-not-the-way'),
                Messages.getMessage('internal-error'),
                Messages.getMessage('TW-001')
            );
        }

        if (!params || params.automatic || params.automatic === undefined) {
            CORE.createCore(constructor);
        }
    };
};
