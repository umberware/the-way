import { Application } from '../main/core/decorator/application.decorator';
import { MessagesEnum } from '../main/core/model/messages.enum';


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
        expect(ex.detail).toBe(MessagesEnum['not-the-way']);
    }
});
