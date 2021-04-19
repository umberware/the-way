import { Get, PathParam, Rest } from '../../../../main';

@Rest('/not-heroes')
export class NotHeroRest {
    public notHeroes = {
        1: {
            name: 'Coringa',
            power: 5000
        }
    };
    @Get('')
    public getNotHeroes(): Promise<any> {
        return new Promise((resolve) => {
            resolve(Object.values(this.notHeroes));
        });
    }
    @Get(':id')
    public getNotHeroById(@PathParam('id') id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            reject(new Error('it\'s so cruel!'))
        });
    }
}
