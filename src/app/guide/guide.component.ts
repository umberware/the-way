import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { GuideService } from './guide.service';
import { AbstractComponent } from '../shared/abstract.component';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent extends AbstractComponent {

  @HostBinding('class') class = 'ui-flex';
  
  actualDoc: any;
  actualGuideDoc: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public appService: AppService,
    public guideService: GuideService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initializeDoc();
  }
  public ngOnDestroy(): void {

  }
  private initializeDoc(): void {
    this.subscriptions$.add(this.appService.currentGuide$.subscribe((actualGuide: string) => {
      if (actualGuide) {
        this.actualDoc = this.appService.currentGuideDoc$.getValue();
        this.actualGuideDoc = this.actualDoc[actualGuide];
      }
    }));
  }
}
