import { LinkModel } from './shared/components/link/link.model';

export const SOCIAL_LINKS: Array<LinkModel> = [
    new LinkModel({
      href: 'https://www.npmjs.com/package/@nihasoft/the-way',
      alias: 'The Way on NPM',
      icon: 'fab fa-npm'
    }),
    new LinkModel({
        href: 'https://github.com/nihasoft/the-way',
        alias: 'The Way on GitHub',
        icon: 'fab fa-github'
    })
]