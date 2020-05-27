import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinkComponent } from './link/link.component';
import { StreamLogoComponent } from './stream-logo/stream-logo.component';

@NgModule({
  declarations: [
    LinkComponent, 
    StreamLogoComponent
  ], imports: [
    CommonModule,
  ], exports: [
    LinkComponent,
    StreamLogoComponent
  ]
})
export class SharedModule { }
