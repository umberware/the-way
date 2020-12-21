import { CORE } from '../core';
import { TheWayApplication } from '../../core/the-way-application';
import { ApplicationException } from '../exeption/application.exception';
import { Messages } from '../shared/messages';

/* eslint-disable @typescript-eslint/ban-types*/
export const Application = (params?: { automatic?: boolean; }) => {
    return (constructor: Function): void => {
        const coreInstance = CORE.getCoreInstance();

        if (!(constructor.prototype instanceof TheWayApplication)) {
            coreInstance.setError(new ApplicationException(
                Messages.getMessage('is-not-the-way'),
                Messages.getMessage('internal-error'),
                Messages.getMessage('TW-001')
            ));
            return;
        }

        if (!params || params.automatic || params.automatic === undefined) {
            coreInstance.initialize(constructor);
        }
    };
};
