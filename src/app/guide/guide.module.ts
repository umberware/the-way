import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuideComponent } from './guide.component';
import { GuideRouteModule } from './guide.route.module';
import { FastSetupComponent } from './fast-setup/fast-setup.component';
import { SharedModule } from '../shared/shared.module';

export function getHighlightLanguages() {
  return {
    typescript: () => import('highlight.js/lib/languages/typescript'),
    css: () => import('highlight.js/lib/languages/css'),
    xml: () => import('highlight.js/lib/languages/xml')
  };
}


@NgModule({
  declarations: [
    GuideComponent,
    FastSetupComponent
  ],
  imports: [
    CommonModule,
    GuideRouteModule,
    SharedModule
  ],
})
export class GuideModule { }
