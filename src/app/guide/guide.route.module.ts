import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuideComponent } from './guide.component';

export const guideRoutes: Routes = [
  {
    path: '**',
    component: GuideComponent
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
