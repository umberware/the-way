import { switchMap } from 'rxjs/operators';

import { Application, TheWayApplication, Inject, ApplicationException, Messages, InternalException, ErrorCodeEnum, CORE } from '../main/index';
import { EnvironmentTest } from './environment/environtment.test';
import { Logger } from '../main/core/shared/logger';
import { UserRestTest } from './application/rest/user.rest.test';
import { CustomSecurityServiceTest } from './application/service/custom-security.service.test';
import { CustomServerConfigurationTest } from './application/configuration/custom-server.configuration.test';
import { SignInModel } from './application/rest/model/sign-in.model';

@Application({
    automatic: false,
    custom: [CustomSecurityServiceTest, CustomServerConfigurationTest]
})
export class Main extends TheWayApplication {
    @Inject() logService: Logger;
    @Inject() userRest: UserRestTest

    public start(): void {
        this.logService.debug('Running...');
    }
}

afterAll(done => {
    EnvironmentTest.whenCoreWasDestroyed(done);
});

beforeAll(done => {
    process.argv.push('--the-way.server.file.enabled=true');
    process.argv.push('--the-way.server.file.fallback=true');
    new Main();
    EnvironmentTest.whenCoreReady(done);
});

describe('The Way Tests - File & Rest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    test('Post: Sign in', done => {
        const signInModel = {
            username: 'batman',
            password: '1234567890'
        } as SignInModel;

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').subscribe(
            (result: {token: string}) => {
                expect(result).not.toBeUndefined();
                expect(result.token).not.toBeUndefined();
                done();
            }, (error: any) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })
    test('Post: Sign in with wrong username', done => {
        const signInModel = {
            username: 'Batma2n',
            password: '1234567890'
        } as SignInModel;

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').subscribe(
            (result: {token: string}) => {
                expect(result).toBeUndefined();
                done();
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                expect(error.code).toBe(ErrorCodeEnum.UNAUTHORIZED);
                done();
            }
        );
    })
    test('Post: Sign in with wrong password', done => {
        const signInModel = {
            username: 'batman',
            password: '12345sasd67890'
        } as SignInModel;

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').subscribe(
            (result: {token: string}) => {
                expect(result).toBeUndefined();
                done();
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                expect(error.code).toBe(ErrorCodeEnum.UNAUTHORIZED);
                done();
            }
        );
    })
    test('Get and Post: Sign in and get the user claims', done => {
        const signInModel = {
            username: 'batman',
            password: '1234567890'
        } as SignInModel;

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').pipe(
            switchMap((result: {token: string}) => {
                return EnvironmentTest.Get<any>('/api/user', {'Authorization': 'Bearer ' + result.token});
            })
        ).subscribe(
            (result: any) => {
                expect(result).not.toBeUndefined();
                expect(result.name).toBe('Batman X');
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })
    test('Get: Try to get user without be logged', done => {
        EnvironmentTest.Get<any>('/api/user').subscribe(
            (result: any) => {
                expect(result).toBeUndefined();
                done();
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                expect(error.code).toBe(ErrorCodeEnum.NOT_ALLOWED)
                done();
            }
        );
    })

    test('Post: Create a new user', done => {
        const user = {
            username: 'projectX',
            name: 'unknow',
            password: '1234567891',
            profiles: [1, 8]
        }

        const signInModel = {
            username: 'batman',
            password: '1234567890'
        } as SignInModel;

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').pipe(
            switchMap((result: {token: string}) => {
                return EnvironmentTest.Post<any>(user, '/api/user', {'Authorization': 'Bearer ' + result.token});
            })
        ).subscribe(
            (result: any) => {
                expect(result).not.toBeUndefined();
                expect(result.username).toBe('projectX');
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })
    test('Post: Sign in with the new user and try to create a new user', done => {
        const signInModel = {
            username: 'projectX',
            password: '1234567891'
        } as SignInModel;

        const user = {
            username: 'xxx',
            name: 'unknow',
            password: '1234567891',
            profiles: [1, 8]
        }

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').pipe(
            switchMap((result: {token: string}) => {
                return EnvironmentTest.Post<any>(user, '/api/user', {'Authorization': 'Bearer ' + result.token});
            })
        ).subscribe(
            (result: any) => {
                expect(result).toBeUndefined();
                done();
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                expect(error.code).toBe(ErrorCodeEnum.NOT_ALLOWED);
                done();
            }
        );
    })
    test('Post: Try to create a new user with existing username', done => {
        const user = {
            username: 'projectX',
            name: 'unknow',
            password: '1234567891',
            profiles: [1, 8]
        }

        const signInModel = {
            username: 'batman',
            password: '1234567890'
        } as SignInModel;

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').pipe(
            switchMap((result: {token: string}) => {
                return EnvironmentTest.Post<any>(user, '/api/user', {'Authorization': 'Bearer ' + result.token});
            })
        ).subscribe(
            (result: any) => {
                expect(result).toBeUndefined();
                done();
            }, (error: ApplicationException) => {
                expect(error).not.toBeUndefined();
                expect(error.code).toBe(ErrorCodeEnum.BAD_REQUEST)
                done();
            }
        );
    })

    test('Get: Verify token', done => {
        const signInModel = {
            username: 'projectX',
            password: '1234567891'
        } as SignInModel;

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').pipe(
            switchMap((result: {token: string}) => {
                return EnvironmentTest.Get<boolean>('/api/user/verify', {'Authorization':   'Bearer ' + result.token});
            })
        ).subscribe(
            (result: boolean) => {
                expect(result).not.toBeUndefined();
                expect(result).toBe(true);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    });
    test('Get: Test the @Request and @Response', done => {
        EnvironmentTest.Get<boolean>('/api/user/check').subscribe(
            (result: boolean) => {
                expect(result).not.toBeUndefined();
                expect(result).toBe(true);
                done();
            }, (error: ApplicationException) => {
                expect(error).toBeUndefined();
                done();
            }
        );
    })

    test('Get: Test the @Request and @Response', done => {
        EnvironmentTest.Get<boolean>('/api/user/test-internal-exception').subscribe(
            (result: boolean) => {
                expect(result).toBeUndefined();
            }, (error: InternalException) => {
                expect(error).not.toBeUndefined();
                expect(error.detail).toBe('internal-server-worker');
                done();
            }
        );
    });
    test('Get and Post: Sign in and pass incorrect token on get user', done => {
        const signInModel = {
            username: 'batman',
            password: '1234567890'
        } as SignInModel;

        EnvironmentTest.Post<{token: string}>(signInModel, '/api/sign/in').pipe(
            switchMap((result: {token: string}) => {
                return EnvironmentTest.Get<any>('/api/user', {'Authorization': result.token});
            })
        ).subscribe(
            (result: any) => {
                expect(result).toBeUndefined();
            }, (error: ApplicationException) => {
                expect(error).toBeDefined();
                expect(error.detail).toBe(Messages['rest-invalid-token']);
                done();
            }
        );
    });
    test('Get and Post: Sign in and pass incorrect token with bearer on get user', done => {
        EnvironmentTest.Get<any>('/api/user', {'Authorization': 'Bearer asasdadasd'}).subscribe(
            (result: any) => {
                expect(result).toBeUndefined();
            }, (error: ApplicationException) => {
                expect(error).toBeDefined();
                expect(error.detail).toBe(Messages['rest-invalid-token']);
                done();
            }
        );
    });
    test('Post: Sign with no claims', done => {
        const signInModel = {
            username: 'batman',
            password: '1234567890'
        } as SignInModel;
        EnvironmentTest.Post<{token: string}>(signInModel, '/api/user/claims/sign/in/null').pipe(
            switchMap((result: {token: string}) => {
                return EnvironmentTest.Get<any>('/api/user/claims/null', {'Authorization': 'Bearer ' + result.token});
            })
        ).subscribe(
            (result: boolean) => {
                expect(result).toBeUndefined();
            }, (error: ApplicationException) => {
                expect(error).toBeDefined();
                expect(error.detail).toBe(Messages['rest-cannot-perform']);
                done();
            }
        );
    });
});
