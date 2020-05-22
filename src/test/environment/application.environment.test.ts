import { TheWayApplication, Application } from '../../main/index';

@Application()
export class App extends TheWayApplication {
    public called = false;
    public start(): void {
        console.log('?')
        this.called = true;
    }
}