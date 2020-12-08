import { Observable } from 'rxjs';

import { ConfigurationsModel } from '../model/configurations-model';
import { Logger } from '../shared/logger';
import { CORE } from '../core';

export  class ConfigurationHandler {
    protected CONFIGURATIONS: ConfigurationsModel;

    constructor(protected core: CORE, protected logger: Logger) {
        this.initialize();
    }

    protected initialize(): void {
        this.CONFIGURATIONS = {
            configure$: new  Array<Observable<boolean>>(),
            destructable: []
        };
    }
}

// import { Messages } from '../shared/messages';
// import { ApplicationException } from '../exeption/application.exception';
// import { ErrorCodes } from '../shared/error-codes';
// import { AbstractConfiguration } from '../configuration/abstract.configuration';
// import { Destroyable } from '../shared/destroyable';

// public configure(): Observable<boolean> {
//     return forkJoin(this.CONFIGURATIONS.configure$).pipe(
//         map((values: Array<boolean>) => {
//             const allConfigured = values.find((value: boolean) => !value) === undefined;
//             if (allConfigured) {
//                 return true;
//             } else {
//                 throw new ApplicationException(Messages['not-configured'], Messages['internal-error'], ErrorCodes['RU-007']);
//             }
//         })
//     );
// }
// public configureInstance(instance: AbstractConfiguration): void {
//     this.CONFIGURATIONS.configure$.push(instance.configure().pipe(take(1)));
// }
// public destroyConfigurations(): Observable<boolean> {
//     const destructions: Array<Observable<boolean>> = [];
//
//     for(const configurationInstance of this.CONFIGURATIONS.destructable) {
//         destructions.push((configurationInstance as AbstractConfiguration).destroy().pipe(take(1)));
//     }
//
//     if (destructions.length === 0) {
//         return of(true);
//     } else {
//         return forkJoin(destructions).pipe(
//             map((values: Array<boolean>) => {
//                 const allDestroyed = values.find((value: boolean) => !value) === undefined;
//
//                 if (!allDestroyed) {
//                     this.logger.errorWithMessage(
//                         'Some configurations aren\'t destroyed',
//                         new ApplicationException(Messages['not-destroyed'], Messages['internal-error'], ErrorCodes['RU-006'])
//                     );
//                 }
//                 return true;
//             }),
//             catchError((error: any) => {
//                 this.logger.errorWithMessage('Error when destroying a destroyable...', error);
//                 return of(true);
//             })
//         );
//     }
// }
// registerDestroyable(destroyable: Destroyable): void {
//     this.CONFIGURATIONS.destructable.push(destroyable);
// }
