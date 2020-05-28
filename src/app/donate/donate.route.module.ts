import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonateComponent } from './donate.component';
import { CompletedComponent } from './completed/completed.component';
import { CanceledComponent } from './canceled/canceled.component';
import { RequestComponent } from './request/request.component';

export const donateRoutes: Routes = [
  {
    path: '',
    component: DonateComponent,
    children: [
      {
          path: 'completed',
          component: CompletedComponent
      },
      {
          path: 'canceled',
          component: CanceledComponent
      },{
        path: '',
        component: RequestComponent
      }
    ]
  }
];

@NgModule({
    imports: [
      RouterModule.forChild(donateRoutes)
    ],
    exports: [
      RouterModule,
    ]
})
export class DonateRouteModule {}
