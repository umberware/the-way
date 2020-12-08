import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { ConfigurationsModel } from '../model/configurations-model';
import { Logger } from '../shared/logger';
import { CORE } from '../core';
import { MessagesEnum } from '../model/messages.enum';
import { ApplicationException } from '../exeption/application.exception';
import { ErrorCodeEnum } from '../exeption/error-code.enum';
import { AbstractConfiguration } from '../configuration/abstract.configuration';
import { Destroyable } from '../shared/destroyable';

export  class ConfigurationHandler {
    protected CONFIGURATIONS: ConfigurationsModel;

    constructor(protected core: CORE, protected logger: Logger) {
        this.initialize();
    }

    public configure(): Observable<boolean> {
        return forkJoin(this.CONFIGURATIONS.configure$).pipe(
            map((values: Array<boolean>) => {
                const allConfigured = values.find((value: boolean) => !value) === undefined;
                if (allConfigured) {
                    return true;
                } else {
                    throw new ApplicationException(MessagesEnum['not-configured'], MessagesEnum['internal-error'], ErrorCodeEnum['RU-007']);
                }
            })
        );
    }
    public configureInstance(instance: AbstractConfiguration): void {
        this.CONFIGURATIONS.configure$.push(instance.configure().pipe(take(1)));
    }
    public destroyConfigurations(): Observable<boolean> {
        const destructions: Array<Observable<boolean>> = [];

        for(const configurationInstance of this.CONFIGURATIONS.destructable) {
            destructions.push((configurationInstance as AbstractConfiguration).destroy().pipe(take(1)));
        }

        if (destructions.length === 0) {
            return of(true);
        } else {
            return forkJoin(destructions).pipe(
                map((values: Array<boolean>) => {
                    const allDestroyed = values.find((value: boolean) => !value) === undefined;

                    if (!allDestroyed) {
                        this.logger.errorWithMessage(
                            'Some configurations aren\'t destroyed',
                            new ApplicationException(MessagesEnum['not-destroyed'], MessagesEnum['internal-error'], ErrorCodeEnum['RU-006'])
                        );
                    }
                    return true;
                }),
                catchError((error: any) => {
                    this.logger.errorWithMessage('Error when destroying a destroyable...', error);
                    return of(true);
                })
            );
        }
    }
    protected initialize(): void {
        this.CONFIGURATIONS = {
            configure$: new  Array<Observable<boolean>>(),
            destructable: []
        };
    }
    registerDestroyable(destroyable: Destroyable): void {
        this.CONFIGURATIONS.destructable.push(destroyable);
    }
}
