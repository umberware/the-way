import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TheWayComponent } from './the-way/the-way.component';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TheWayComponent,
  }, {
    path: 'donate',
    loadChildren: () => import('./donate/donate.module').then(mod => mod.DonateModule),
  }, {
    path: 'guide',
    loadChildren: () => import('./guide/guide.module').then(mod => mod.GuideModule),
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {
      anchorScrolling: 'enabled',
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouteModule {}
