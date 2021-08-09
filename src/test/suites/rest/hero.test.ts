import { map, switchMap } from 'rxjs/operators';

import { CORE, CoreMessageService, HttpCodesEnum, RestException } from '../../../main';
import { EnvironmentTest } from '../../resources/environment/environment.test';
import { HttpsRequestorEnvironment } from '../../resources/environment/https-requestor.environment.test';

afterAll(done => {
    EnvironmentTest.clear(done);
});
beforeEach(() => {
    EnvironmentTest.spyProcessExit();
})
describe('Rest', () => {
    beforeAll(done => {
        process.argv.push('--the-way.core.scan.enabled=true');
        process.argv.push('--the-way.core.scan.path=../../resources/rest/hero');
        process.argv.push('--the-way.core.log.level=0');
        process.argv.push('--the-way.server.http.enabled=false');
        process.argv.push('--the-way.server.https.enabled=true');
        process.argv.push('--the-way.server.https.key-path=src/test/resources/certificate/localhost.key');
        process.argv.push('--the-way.server.https.cert-path=src/test/resources/certificate/localhost.cert');
        import('../../resources/environment/main/not-automatic-main.test').then(
            (result) => {
                new result.NotAutomaticMainTest();
                CORE.whenReady().subscribe(
                    () => {
                        done()
                    }
                );
            }
        );
    });
    test('Heroes: Get Hero', done => {
        HttpsRequestorEnvironment.Get('/api/heroes/hero/0').subscribe(
            (hero: any) => {
                expect(hero.name).toBe('batman');
                expect(hero.power).toBe(10000);
                done();
            }
        );
    });
    test('Heroes: Get A Non Existing Hero', done => {
        HttpsRequestorEnvironment.Get('/api/heroes/hero/1000').subscribe(
            (hero: any) => {
               expect(hero).toBeUndefined();
            }, error => {
                expect(error).toBeDefined();
                expect(error.code).toBe(HttpCodesEnum.NotFound);
                done();
            }
        );
    });
    test('Heroes: All Heroes', done => {
        HttpsRequestorEnvironment.Get('/api/heroes').subscribe(
            (heroes: any) => {
                const hero = heroes[0];
                expect(hero.name).toBe('batman');
                expect(hero.power).toBe(10000);
                expect(heroes.length).toBe(3);
                done();
            }
        );
    });
    test('Heroes: All Not Heroes', done => {
        HttpsRequestorEnvironment.Get('/api/not-heroes').subscribe(
            (heroes: any) => {
                const hero = heroes[0];
                expect(hero.name).toBe('Coringa');
                expect(hero.power).toBe(5000);
                expect(heroes.length).toBe(1);
                done();
            }
        );
    });
    test('Heroes: Not Hero', done => {
        HttpsRequestorEnvironment.Get('/api/not-heroes/1').subscribe(
            () => {},
            (error: RestException) => {
                expect(error).toBeDefined();
                expect(error.message).toBe('it\'s so cruel!');
                done();
            }
        );
    });
    test('Heroes: Imparcial', done => {
        HttpsRequestorEnvironment.Get('/api/imparcials/1').subscribe(
            () => {},
            (error: RestException) => {
                expect(error).toBeDefined();
                expect(error.code).toBe(500);
                expect(error.description).toBe(CoreMessageService.getMessage('http-internal-server-error'))
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-path-parameter', [':id']))
                done();
            }
        );
    });
    test('Heroes: Imparcials', done => {
        HttpsRequestorEnvironment.Get('/api/imparcials').subscribe(
            () => {},
            (error: any) => {
                expect(error).toBeDefined();
                expect(error.message).toBe('What is this?');
                done();
            }
        );
    });
    test('Heroes: Empty Imparcial', done => {
        HttpsRequestorEnvironment.Post(undefined,'/api/imparcials').subscribe(
            () => {},
            (error: any) => {
                expect(error).toBeDefined();
                expect(error.description).toBe(CoreMessageService.getMessage('http-bad-request'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-empty-request'));
                done();
            }
        );
    });
    test('Heroes: Create Imparcial', done => {
        HttpsRequestorEnvironment.Post({ x: 0 },'/api/imparcials').subscribe(
            () => {},
            (error: any) => {
                expect(error).toBeDefined();
                expect(error.description).toBe(CoreMessageService.getMessage('http-internal-server-error'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-empty-response'));
                done();
            }
        );
    });
    test('Heroes: Update Imparcial', done => {
        HttpsRequestorEnvironment.Patch({ x: 0 },'/api/imparcials').subscribe(
            () => {},
            (error: any) => {
                expect(error).toBeDefined();
                expect(error.description).toBe(CoreMessageService.getMessage('http-internal-server-error'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-empty-response'));
                done();
            }
        );
    });
    test('Heroes: Hero By Power', done => {
        HttpsRequestorEnvironment.Get('/api/heroes/power?power=8500').subscribe(
            (heroes: any) => {
                expect(heroes.length).toBe(2);
                done();
            }
        );
    });
    test('Heroes: New Hero & Rebalancing', done => {
        const hero = {
            name: 'aquaman',
            power: 8530
        }
        let token: string;
        HttpsRequestorEnvironment.Post({ username: 'wayne' }, '/api/sign/in').pipe(
            switchMap((tokenResult: any) => {
                token = tokenResult.token;
                return HttpsRequestorEnvironment.Post(hero, '/api/heroes', {Authorization: 'Bearer ' + token}).pipe(
                    switchMap((newHero: any) => {
                        expect(newHero.name).toBe('aquaman');
                        expect(newHero.power).toBe(8530);
                        hero.power = 9720;
                        return HttpsRequestorEnvironment.Put(hero, '/api/heroes/byName', {Authorization: 'Bearer ' + token}).pipe(
                            switchMap((updatedHero: any) => {
                                expect(updatedHero.name).toBe('aquaman');
                                expect(updatedHero.power).toBe(9720);

                                return HttpsRequestorEnvironment.Get('/api/heroes').pipe(
                                    map((heroes: any) => {
                                        expect(heroes.length).toBe(4);
                                        return heroes.find((resultedHero: any) =>
                                            resultedHero.name === 'aquaman')
                                    })
                                );
                            })
                        )
                    })
                )
            })
        ).subscribe(
            (hero: any) => {
                expect(hero.name).toBe('aquaman');
                expect(hero.power).toBe(9720);
                done();
            }
        );
    });
    test('Heroes: Delete Hero', done => {
        let chosenHero: any;
        let beforeSize: number;
        HttpsRequestorEnvironment.Get('/api/heroes').pipe(
            switchMap((heroes: any) => {
                chosenHero = heroes[1]
                beforeSize = heroes.length;
                return HttpsRequestorEnvironment.Delete('/api/heroes/hero/' + chosenHero.id).pipe(
                    switchMap(() => {
                        return HttpsRequestorEnvironment.Get('/api/heroes');
                    })
                );
            })
        ).subscribe(
            (heroes: any) => {
                expect(heroes.length).toBe(beforeSize - 1);
                expect(heroes.find((resultedHero: any) =>
                    resultedHero.name === chosenHero.name)).toBeUndefined();
                done();
            }
        );
    });
    test('Heroes: Not Provied Token', done => {
        HttpsRequestorEnvironment.Post(undefined, '/api/heroes').subscribe(
            () => {
            }, (error => {
                expect(error).toBeDefined();
                expect(error.code).toBe(401);
                expect(error.description).toBe(CoreMessageService.getMessage('http-not-authorized'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-no-token'));
                done();
            })
        );
    });
    test('Heroes: Not Bearer Token', done => {
        HttpsRequestorEnvironment.Post(undefined, '/api/heroes', { Authorization: 'das'}).subscribe(
            () => {
            }, (error => {
                expect(error).toBeDefined();
                expect(error.code).toBe(401);
                expect(error.description).toBe(CoreMessageService.getMessage('http-not-authorized'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-invalid-token'));
                done();
            })
        );
    });
    test('Heroes: Invalid Token', done => {
        HttpsRequestorEnvironment.Post(undefined, '/api/heroes', { Authorization: 'Bearer asad'}).subscribe(
            () => {
            }, (error => {
                expect(error).toBeDefined();
                expect(error.code).toBe(401);
                expect(error.description).toBe(CoreMessageService.getMessage('http-not-authorized'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-invalid-token'));
                done();
            })
        );
    });
    test('Heroes: No Claims', done => {
        let token;
        HttpsRequestorEnvironment.Post({ username: 'wayne' }, '/api/sign/in/2').pipe(
            switchMap((tokenResult: any) => {
                token = tokenResult.token;
                const hero = {
                    name: 'aquaman',
                    power: 9420
                }
                return HttpsRequestorEnvironment.Put(hero, '/api/heroes/byName', { Authorization: 'Bearer ' + token})
            })
        ).subscribe(
            (hero: any) => {
                expect(hero.name).toBe('aquaman');
                expect(hero.power).toBe(9420);
                done();
            }
        );
    });
    test('Heroes: Wrong Profile', done => {
        let token;
        const hero = {
            name: 'happy-batman',
            power: 8490
        }
        HttpsRequestorEnvironment.Post({ username: 'xas' }, '/api/sign/in').pipe(
            switchMap((tokenResult: any) => {
                token = tokenResult.token;
                return HttpsRequestorEnvironment.Post(hero, '/api/heroes', { Authorization: 'Bearer ' + token})
            })
        ).subscribe(
            () => {},
            error => {
                expect(error.code).toBe(403);
                expect(error.description).toBe(CoreMessageService.getMessage('http-not-allowed'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-cannot-perform-action'));
                done();
            }
        );
    });
    test('Heroes: Claims With no Profile', done => {
        let token;
        const hero = {
            name: 'happy-batman',
            power: 8490
        }
        HttpsRequestorEnvironment.Post({ username: 'xas' }, '/api/sign/in/3').pipe(
            switchMap((tokenResult: any) => {
                token = tokenResult.token;
                return HttpsRequestorEnvironment.Post(hero, '/api/heroes', { Authorization: 'Bearer ' + token})
            })
        ).subscribe(
            () => {},
            error => {
                expect(error.code).toBe(403);
                expect(error.description).toBe(CoreMessageService.getMessage('http-not-allowed'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-cannot-perform-action'));
                done();
            }
        );
    });
    test('Heroes: Claims With non Array of Profiles', done => {
        let token;
        const hero = {
            name: 'happy-batman',
            power: 8490
        }
        HttpsRequestorEnvironment.Post({ username: 'xas' }, '/api/sign/in/4').pipe(
            switchMap((tokenResult: any) => {
                token = tokenResult.token;
                return HttpsRequestorEnvironment.Post(hero, '/api/heroes', { Authorization: 'Bearer ' + token})
            })
        ).subscribe(
            () => {},
            error => {
                expect(error.code).toBe(403);
                expect(error.description).toBe(CoreMessageService.getMessage('http-not-allowed'));
                expect(error.detail).toBe(CoreMessageService.getMessage('error-rest-cannot-perform-action'));
                done();
            }
        );
    });
});
