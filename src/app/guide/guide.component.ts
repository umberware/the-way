import { Component, HostBinding, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppService } from '../app.service';
import { GuideService } from './guide.service';
import { AbstractComponent } from '../shared/abstract.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent extends AbstractComponent {

  @HostBinding('class') class = 'ui-flex';

  guides: {
    [key: string] : {
      states: {[key: string]: any},
      docs: {[key: string]: any}
    }
  } = {};

  canShowOptions: boolean = true;
  fromMe: boolean = false;
  guidesStates: Array<any> = [];
  mobile: boolean = false;
  selectedGuideState: any;
  selectedSubGuideState: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public appService: AppService,
    public guideService: GuideService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initializeGuidesStatesAndDoc();
    this.eventResize();
  }
  public ngOnDestroy(): void {}

  @HostListener('window:resize')
  public eventResize(): void{
    if (window.innerWidth < 800) {
      this.mobile = true;
      this.canShowOptions = false;
    } else {
      this.mobile = false;
      this.canShowOptions = true;
    }
  }
  private initializeGuidesStatesAndDoc(): void {
    this.subscriptions$.add(this.appService.guidesStates$.pipe(
      switchMap((guidesStates: any) => {
        for (const state in guidesStates) {
          if (!this.guides[state]) {
            this.guides[state] = {states: {}, docs: {}};
          }
          this.guides[state].states = guidesStates[state];
          this.guidesStates.push(guidesStates[state]);
        }
        return this.appService.guidesDocs$;
      })
    ).subscribe(
      (guidesDocs: any) => {
        const paths = this.route.snapshot.url;
        const path = (!paths[0]) ? this.guidesStates[0].name : paths[0].path;
        const fragment = this.route.snapshot.fragment;
        for (const state in guidesDocs) {
          this.guides[state].docs = guidesDocs[state]; 
          if (path === state) {
            this.eventSelected(null, this.guides[state].states, true);
            if (fragment) {
              this.eventSelected(null, this.guides[state].states.sub.find((subGuide: any) => subGuide.name === fragment), false);
            }
          }
        } 
      }
    ));
  }
  public eventOpenOptions(event: any): void {
    this.canShowOptions = true;
    event.stopPropagation();
  }
  public eventSelected(event: any, guide: any, isPrincipal: boolean): void {
    if (!isPrincipal) {
      this.router.navigate(['/guide/' + this.selectedGuideState.name], {fragment: guide.name});
      this.fromMe = true;
    } else {
      this.fromMe = true;
      this.router.navigate(['/guide/' + guide.name]);
    }
    this.loadState(guide, isPrincipal);
    
    if (this.mobile && this.canShowOptions) {
      this.canShowOptions = false;
    }

    if (event) { 
      event.stopPropagation();
    }
  }
  public eventViewingDocument(event: string): void {
    const sub = this.guides[this.selectedGuideState.name].states.sub.find((sub: any) => sub.name === event);
    this.eventSelected(null, sub, false);
  }
  
  @HostListener('document:click', ['$event'])
  public eventOutsideClick(event): void {
    if (this.mobile && this.canShowOptions) {
      this.canShowOptions = false;
    }
  }

  private loadState(guide: any, isPrincicpal: boolean): void {
    if (isPrincicpal) {
      this.selectedGuideState = guide;
      this.selectedSubGuideState = null;
      this.guideService.actualGuide$.next(this.guides[this.selectedGuideState.name]);
      this.guideService.actualSubGuideState$.next(null);
    } else {
      this.selectedSubGuideState = guide;
      this.guideService.actualSubGuideState$.next(guide);
    }
  }
}
