import { BodyParam, CoreSecurityService, Inject, Post, Rest } from '../../../../main';

@Rest('sign/in')
export class SignInRest {

    @Inject security: CoreSecurityService;

    @Post('')
    public signIn(@BodyParam signIn: any): {token: string;} {
        const profiles = [];
        if (signIn.username === 'wayne') {
            profiles.push('justice-league-master')
        } else if (signIn.username === 'killua') {
            profiles.push('hunter-master')
        } else {
            profiles.push('justice-league-soldier')
        }
        return {
            token: this.security.generateToken({ username: 'Wayne', profiles })
        }
    }
    @Post('2')
    public signIn2(): { token: string; } {
        return {
            token: this.security.generateToken(undefined)
        }
    }
    @Post('3')
    public signIn3(): { token: string; } {
        return {
            token: this.security.generateToken({ username: 'vader'})
        }
    }
    @Post('4')
    public signIn4(): { token: string; } {
        return {
            token: this.security.generateToken({ username: 'vader', profiles: 'x'})
        }
    }
}