import 'reflect-metadata';

import { CORE } from '../core';
import { TheWayApplication } from '../../core/the-way-application';
import { ApplicationException } from '../exeption/application.exception';

export function Application(params?: {custom?: Array<any>; automatic?: boolean}) {
    return (constructor: Function): void => {
        const core = CORE.getCoreInstance();

        if (!(constructor.prototype instanceof TheWayApplication)) {
            throw new ApplicationException('Your @Application class must extends the TheWayApplication', 'Application Error', 'RU-005')
        }

        if (params) {
            if (params.custom) {
                core.setCustomInstances(params.custom);
            }

            if (params.automatic || params.automatic === undefined) {
                core.buildMain(constructor);
            }
        }
    }
}
