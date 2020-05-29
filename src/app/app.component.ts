import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { filter } from 'rxjs/operators';

import { AppService } from './app.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ParticlesConfig } from './particles.config';

import * as guides from './guides.json';
import * as guidesDoc from './guides-doc.json';
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
  public isGuide: boolean = false;
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
    this.guides = guides['0.5.2'];
    this.guidesDoc = guidesDoc['0.5.2'];
    this.appService.currentGuideDoc$.next(this.guidesDoc);
    this.version = this.appService.version = guides['currentVersion'];
  }

  public ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.isGuide = (event as NavigationEnd).url.includes('/guide');
    });
    this.initializeParticles();
  }

  private initializeParticles(): void {
    particlesJS('particles-js', ParticlesConfig, function() {});
  }
  public ngOnDestroy(): void {
  }
}
