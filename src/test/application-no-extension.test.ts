import { Application } from '../main/core/decorator/application.decorator';
import { Messages } from '../main/core/shared/messages';


it('The Way Tests - Application No Extension', () => {
    try {
        @Application()
        class Main {
            public start(): void {
                console.log('Running');
            }
        }
    } catch (ex) {
        expect(ex).toBeDefined();
        expect(ex.detail).toBe(Messages['not-the-way']);
    }
});
