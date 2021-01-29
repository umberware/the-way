import { Application, TheWayApplication } from '../../main';

const processExitSpy = spyOn(process, 'exit');
processExitSpy.and.returnValue('banana');

@Application({
    automatic: false
})
export class NotAutomaticMainTest extends TheWayApplication {
}