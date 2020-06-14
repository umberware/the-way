import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { AppService } from './app.service';
import { ParticlesConfig } from './particles.config';

import * as guidesStates from './guides-states.json';
import * as guidesDocs from './guides-docs.json';
import { AbstractComponent } from './shared/abstract.component';

declare var particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AbstractComponent {
  public systemId = 'The Way';
  public systemName = 'The Way';
  public guides: any;
  public guidesDoc: any;
  public version: string;

  constructor(
    private titleService: Title,
    private appService: AppService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    super();
    this.titleService.setTitle(this.systemName);
    this.version = this.appService.version = guidesStates['currentVersion'].toString().trim();
    this.appService.selectedVersion$.next(this.version);
    this.appService.guides$.next(guidesStates);
    this.appService.guidesStates$.next(guidesStates['default'][this.version]);
    this.appService.guidesDocs$.next(guidesDocs['default'][this.version]);
  }

  public ngOnInit(): void {
    this.initializeParticles();
  }

  private initializeParticles(): void {
    particlesJS('particles-js', ParticlesConfig, function() {});
  }
  public ngOnDestroy(): void {
  }
}
