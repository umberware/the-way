import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinkComponent } from './components/link/link.component';
import { StreamLogoComponent } from './components/stream-logo/stream-logo.component';
import { FragmentedDomDirective } from './directive/fragmented-dom.directive';

@NgModule({
  declarations: [
    LinkComponent, 
    StreamLogoComponent,
    FragmentedDomDirective
  ], imports: [
    CommonModule,
  ], exports: [
    LinkComponent,
    StreamLogoComponent,
    FragmentedDomDirective
  ]
})
export class SharedModule { }
