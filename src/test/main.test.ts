import { CORE } from '../main/core/core';

import { TheWayApplication, Application } from '../main/index';
import { timer } from 'rxjs';

@Application()
export class App extends TheWayApplication {
    public start(): void {
        console.log('Running...');
    }
}

afterAll(done => {
    CORE.getCoreInstance().destroy().subscribe(() => {
        done();
    });
})

beforeAll(done => {
    const core = CORE.getCoreInstance()
    core.ready$.subscribe((ready: boolean) => {
        if (ready) {
            timer(1000).subscribe(() => {
                const main = core.getApplicationInstance() as App;
                expect(main).not.toBeNull();
                done();
            })
        }
    })
})

it('The main must be initialized', () => {
    const core = CORE.getCoreInstance();
    expect(core.ready$.getValue()).toBe(true);
});