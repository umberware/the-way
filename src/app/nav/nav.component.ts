import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { AppService } from '../app.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() systemName: string;
  @Input() version: string;
  @Input() guides: {[key: string]: any};

  actualGuide: string;
  actualSubGuide: string;
  actualGuides: Array<any> = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private appService: AppService
  ) {}

  public ngOnInit(): void {
    this.initializeGuides();
    this.handleUrl(window.location.href.replace('/http:\/\/.*\//', ''));
    
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.handleUrl((event as NavigationEnd).url);
    });
  }
  public eventNavigateToHome(): void {
    this.router.navigate(['/']);
  }
  public eventSelected(event: any, actualGuide: any, isPrincipal: boolean): void {
    if (!isPrincipal) {
      this.router.navigate(['/guide/' + this.actualGuide], {fragment: actualGuide.name});
    } else {
      this.router.navigate(['/guide/' + actualGuide.name]);
    }
    event.stopPropagation();
  }
  private handleUrl(url: string): void {
    const actualState = url.split('/').pop().replace('/', '').split('#');
      this.actualGuide = actualState[0];
      this.actualSubGuide = actualState[1];
      this.appService.currentGuide$.next(this.actualGuide);
      this.appService.currentSubGuide$.next(this.actualSubGuide);
  }
  private initializeGuides(): void {
    for(const key in this.guides) {
      this.actualGuides.push(this.guides[key]);
    }
  }
}
