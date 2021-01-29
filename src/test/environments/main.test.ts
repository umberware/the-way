import { Application, TheWayApplication } from '../../main';

const processExitSpy = spyOn(process, 'exit');
processExitSpy.and.returnValue('banana');

@Application()
export class Main extends TheWayApplication {}