import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuideComponent } from './guide.component';
import { GuideRouteModule } from './guide.route.module';
import { FastSetupComponent } from '../fast-setup/fast-setup.component';
import { RestDecoratorComponent } from '../rest-decorator/rest-decorator.component';

@NgModule({
  declarations: [
    GuideComponent,
    FastSetupComponent,
    RestDecoratorComponent,
  ],
  imports: [
    CommonModule,
    GuideRouteModule
  ]
})
export class GuideModule { }
