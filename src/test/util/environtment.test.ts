import { timer } from 'rxjs';

import { CORE } from '../../main/core/core';

export class EnvironmentTest {
    public static whenCoreReady(whenReady: Function): void {
        const core = CORE.getCoreInstance();
        core.ready$.subscribe((ready: boolean) => {
            if (ready) {
                timer(1000).subscribe(() => {
                    whenReady();
                })
            }
        })
    }
    public static whenCoreWasDestroyed(whenDie: Function): void {
        CORE.getCoreInstance().destroy().subscribe(() => {
            expect(CORE.instance).toBeUndefined();
            whenDie();
        });
    }
}