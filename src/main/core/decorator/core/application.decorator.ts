import { CORE } from '../../core';
import { TheWayApplication } from '../../the-way-application';
import { ApplicationException } from '../../exeption/application.exception';
import { CoreMessageService } from '../../service/core-message.service';

/* eslint-disable @typescript-eslint/ban-types*/
export const ApplicationMetaKey = 'Application';
/**
 *   @name Application
 *   @description The @Application is the main decorator to use
 *      this library, and their goal is make the Core Sub Process ready
 *      to start the application.
 *   @param automatic this parameter when true, will tell Core to
 *      automatically start your application, creating the dependency tree,
 *      instances, injections, services and configurations.
 *      When false, the Core will start your application when you create
 *      an instance of your class decorated with @Application and extended
 *      with TheWayApplication.
 *      By default, is true
 *   @since 1.0.0
 */
export const Application = (automatic = true) => {
    return (constructor: Function): void => {
        if (!(constructor.prototype instanceof TheWayApplication)) {
            throw new ApplicationException(
                CoreMessageService.getMessage('error-is-not-the-way'),
                CoreMessageService.getMessage('TW-001')
            );
        }

        if (automatic) {
            CORE.createCore(constructor);
        }
        Reflect.defineMetadata(ApplicationMetaKey, Application, constructor);
    };
};
