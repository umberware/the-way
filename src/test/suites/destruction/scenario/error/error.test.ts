import { Observable, Subscriber } from 'rxjs';

import { CORE } from '../../../../../main';

describe('Destruction', () => {
    beforeEach(() => {
        (CORE as any).instances = [];
        const processExitSpy = spyOn(process, 'exit');
        processExitSpy.and.returnValue('banana');
    })
    test('Initialization Error', (done) => {
        import('../../../../environments/not-automatic-main.test').then(
            (value => {
                const core = CORE.getCoreInstance();
                const message = 'Luke, I\'m your father!!!';
                spyOn(core as any, 'configure').and.returnValue(
                    new Observable((observer: Subscriber<boolean>) => {
                        observer.error({
                            detail: message
                        });
                        observer.next(true);
                        observer.complete();
                    })
                );
                new value.NotAutomaticMainTest();
                core.watchError().subscribe(
                    (error) => {
                        if (error) {
                            expect(CORE.getCoreInstance().isDestroyed()).toBeTruthy();
                            expect(error.detail).toBe(message);
                            expect(core.isDestroyed()).toBe(true);
                            done();
                        }
                    });
                core.destroy();
            })
        );
    });
    test('With Error', (done) => {
        const defaultArgs = [ ...process.argv ];
        process.argv.push('--the-way.core.log.enabled=false');
        import('../../../../environments/not-automatic-main.test').then(
            (value => {
                const core = CORE.getCoreInstance();
                const message = 'Wakeup Samurai, We have a city to explode!!';
                spyOn(core as any, 'destroyTheArmy').and.returnValue(
                    new Observable((observer: Subscriber<boolean>) => {
                        observer.error(new Error(message));
                        observer.next(true);
                        observer.complete();
                    })
                );
                new value.NotAutomaticMainTest();
                core.watchError().subscribe(
                (error) => {
                    if (error) {
                        expect(CORE.getCoreInstance().isDestroyed()).toBeTruthy();
                        expect(error.message).toBe(message);
                        expect(core.isDestroyed()).toBe(true);
                        process.argv = defaultArgs;
                        done();
                    }
                });
                core.destroy();
            })
        );
    });
});

