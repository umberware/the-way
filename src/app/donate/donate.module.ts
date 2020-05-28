import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonateComponent } from './donate.component';
import { CompletedComponent } from './completed/completed.component';
import { CanceledComponent } from './canceled/canceled.component';
import { DonateRouteModule } from './donate.route.module';
import { RequestComponent } from './request/request.component';

@NgModule({
  declarations: [DonateComponent, CompletedComponent, CanceledComponent, RequestComponent],
  imports: [
    CommonModule,
    DonateRouteModule
  ]
})
export class DonateModule { }
