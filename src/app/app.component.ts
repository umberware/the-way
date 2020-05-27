import { Component, OnInit, OnDestroy} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { filter } from 'rxjs/operators';

import { AppService } from './app.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ParticlesConfig } from './particles.config';

declare var particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public systemId = 'The Way';
  public systemName = 'The Way';
  public isGuide: boolean = false;
  public version = '0.5.0';

  constructor(
    private titleService: Title,
    private appService: AppService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.titleService.setTitle(this.systemName);
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
