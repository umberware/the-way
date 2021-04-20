import { BodyParam, Get, Patch, PathParam, Post, Rest } from '../../../../main';

@Rest()
export class ImparcialRest {
    @Get('imparcials/:id')
    public getImparcialById(@PathParam(':id') id: string): void {
        return;
    }
    @Get('/imparcials')
    public getImparcials(): void {
        throw Error('What is this?')
    }
    @Post('imparcials')
    public createImparcial(@BodyParam param: any): any {}
    @Patch('imparcials')
    public updateImparcial(): any {}
}
