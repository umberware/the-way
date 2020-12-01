import { ErrorCodeEnum, ApplicationException } from '../../main';

import { EnvironmentTest } from '../environment/environtment.test';
import { HeroModel } from '../application/rest/model/hero.model';

export const heroRestScenarioTest = describe('multiples rest tests', () => {
    test('Head: Hero exists', done => {
        EnvironmentTest.Head<void>('/api/hero/1').subscribe(
            (result: any) => {
                expect(result).toBeUndefined();
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
    test('Head: hero not exists', done => {
        EnvironmentTest.Head<void>('/api/hero/' + 80).subscribe(
            (result: any) => {
                expect(result).toBeUndefined();
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    });
    test('Get: Hero exists', done => {
        EnvironmentTest.Get<HeroModel>('/api/hero/' + 1).subscribe(
            (result: HeroModel) => {
                expect(result).not.toBeUndefined();
                expect(result.id).toBe(1);
                expect(result.name).toBe('Anakin Skywalker');
                expect(result.power).toBe(100001);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
    test('Get: Hero not exists', done => {
        EnvironmentTest.Get<HeroModel>('/api/hero/' + 100).subscribe(
            (result: HeroModel) => {
                expect(result).toBeUndefined();
                done();
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                expect(error.code).toBe(ErrorCodeEnum.NOT_FOUND);
                done();
            }
        );
    });
    test('Post: Create a hero', done => {
        const batman = {
            power: 100000,
            name: 'Batman'
        }
        EnvironmentTest.Post<HeroModel>(batman, '/api/hero').subscribe(
            (result: HeroModel) => {
                expect(result).not.toBeUndefined();
                expect(result.id).toBe(2);
                expect(result.name).toBe('Batman');
                expect(result.power).toBe(100000);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
    test('Post: Create a hero with no hero', done => {
        EnvironmentTest.Post<HeroModel>({}, '/api/hero').subscribe(
            (result: HeroModel) => {
                expect(result).toBeUndefined();
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                done();
            }
        );
    });
    test('Get: Find all heroes', done => {
        EnvironmentTest.Get<Array<HeroModel>>('/api/heroes?id=2&id=1').subscribe(
            (result: Array<HeroModel>) => {
                expect(result).not.toBeUndefined();
                expect(result.length).toBe(2);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
    test('Put: Update hero', done => {
        const batman = {
            power: 100001,
            name: 'Future Batman'
        }
        EnvironmentTest.Put<HeroModel>(batman, '/api/hero/2').subscribe(
            (result: HeroModel) => {
                expect(result).not.toBeUndefined();
                expect(result.name).toBe('Future Batman');
                expect(result.power).toBe(100001);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
    test('Patch: Update hero information', done => {
        const batman = {
            power: 200001
        }
        EnvironmentTest.Patch<HeroModel>(batman, '/api/hero/2').subscribe(
            (result: HeroModel) => {
                expect(result).not.toBeUndefined();
                expect(result.name).toBe('Future Batman');
                expect(result.power).toBe(200001);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
    test('Delete: Remove a Hero', done => {
        EnvironmentTest.Delete<HeroModel>('/api/hero/2').subscribe(
            (result: HeroModel) => {
                expect(result).not.toBeUndefined();
                expect(result.name).toBe('Future Batman');
                expect(result.power).toBe(200001);
                EnvironmentTest.Get<Array<HeroModel>>('/api/heroes').subscribe(
                    (result: Array<HeroModel>) => {
                        expect(result).not.toBeUndefined();
                        expect(result.length).toBe(1);
                        done();
                    }, (error: ApplicationException) => {
                        expect(error).toBeUndefined();
                    }
                );
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
    test('Delete: Remove a Unexisting Hero', done => {
        EnvironmentTest.Delete<HeroModel>('/api/hero/testOne').subscribe(
            (result: HeroModel) => {
                expect(result).toBeUndefined();
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                done();
            }
        );
    });
    test('Delete: Wrong param test', done => {
        EnvironmentTest.Delete<HeroModel>('/api/hero/wrongParam/2').subscribe(
            (result: HeroModel) => {
                expect(result).toBeUndefined;
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                done();
            }
        );
    });
    test('Delete: A path not authenticated trying to use Claims', done => {
        EnvironmentTest.Delete<HeroModel>('/api/hero/wrongAuthentication').subscribe(
            (result: HeroModel) => {
                expect(result).toBeUndefined;
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                done();
            }
        );
    });
    test('Put: Kill a hero', done => {
        EnvironmentTest.Put<HeroModel>(null, '/api/hero/1/kill').subscribe(
            (result: HeroModel) => {
                expect(result).not.toBeUndefined();
                expect(result.name).toBe('Anakin Skywalker');
                expect(result.power).toBe(100001);
                expect(result.alive).toBe(false);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
    test('Put: Ressurect a hero', done => {
        EnvironmentTest.Put<HeroModel>(null, '/api/hero/1/ressurect').subscribe(
            (result: HeroModel) => {
                expect(result).not.toBeUndefined();
                expect(result.name).toBe('Anakin Skywalker');
                expect(result.power).toBe(100001);
                expect(result.alive).toBe(true);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
            }
        );
    });
});