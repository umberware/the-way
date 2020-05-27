import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FastSetupComponent } from '../fast-setup/fast-setup.component';
import { RestDecoratorComponent } from '../rest-decorator/rest-decorator.component';

export const guideRoutes: Routes = [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'fast-setup' 
  }, {
    path: 'fast-setup',
    pathMatch: 'full',
    component: FastSetupComponent, 
  }, {
    path: 'rest-decorator',
    pathMatch: 'full',
    component: RestDecoratorComponent, 
  }
];

@NgModule({
    imports: [
      RouterModule.forChild(guideRoutes)
    ],
    exports: [
      RouterModule,
    ]
})
export class GuideRouteModule {}
