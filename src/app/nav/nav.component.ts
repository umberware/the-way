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

  guides: any = [{
    name: 'fast-setup',
    alias: 'Fast Setup'
  }, {
    name: 'rest-decorator',
    alias: 'Rest decorator',
    sub: [{
      name: 'get'
    },{
      name: 'post'
    },{
      name: 'del'
    },{
      name: 'put'
    }]
  }];
  actualGuide: string;
  actualSubGuide: string;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private appService: AppService
  ) {}

  public ngOnInit(): void {
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
  }
}
