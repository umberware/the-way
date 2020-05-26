import { EnvironmentTest } from '../util/environtment.test';
import { HeroModel } from '../mock/model/hero.model';
import { ApplicationException } from '../../main/core/exeption/application.exception';
import { ErrorCodeEnum } from '../../main/core/exeption/error-code.enum';

export const heroRestScenarioTest = describe('multiples rest tests', () => {
    test('Head: Hero exists', done => {
        EnvironmentTest.Head<void>('/api/hero/' + 1).subscribe(
            (result: any) => {
                expect(result).toBeUndefined();
                done();
            }, (error: any) => {
                expect(error).toBeUndefined();
                done();
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
                expect(result.power).toBe(10001);
                done();
            }, (error: any) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })
    test('Get: Hero not exists', done => {
        EnvironmentTest.Get<HeroModel>('/api/hero/' + 100).subscribe(
            (result: HeroModel) => {
                expect(result).toBeUndefined();
                done();
            }, (error: any) => {
                expect(error).not.toBeUndefined();
                expect(error.code).toBe(ErrorCodeEnum.NOT_FOUND);
                done();
            }
        );
    })
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
            }, (error: any) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })
    test('Get: Find all heroes', done => {
        EnvironmentTest.Get<Array<HeroModel>>('/api/heroes?id=2&id=1').subscribe(
            (result: Array<HeroModel>) => {
                expect(result).not.toBeUndefined();
                expect(result.length).toBe(2);
                done();
            }, (error: any) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })
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
            }, (error: any) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })
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
            }, (error: any) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })
});