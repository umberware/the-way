import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRouteModule } from './app.route.module';
import { AppComponent } from './app.component';
import { TheWayComponent } from './the-way/the-way.component';
import { DonateModule } from './donate/donate.module';
import { SharedModule } from './shared/shared.module';
import { NavComponent } from './nav/nav.component';
import { GuideModule } from './guide/guide.module';
import { HighlightService } from './shared/services/highlight.service';

@NgModule({
  declarations: [
    AppComponent,
    TheWayComponent,
    NavComponent
  ],
  imports: [
    AppRouteModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    DonateModule,
    SharedModule,
    GuideModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
