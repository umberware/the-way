import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';

import { debounceTime, filter } from 'rxjs/operators';

import { AppService } from '../app.service';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  
  acutalGuide: string;
  actualSubGuide: string; 

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public appService: AppService
  ) {}

  public ngOnInit(): void {
    // this.route.fragment.pipe(debounceTime(100)).subscribe((fragment: string) => {
    //   console.log(fragment);
    //   this.actualSubGuide = fragment;
    //   this.appService.currentSubGuide$.next(this.actualSubGuide);
    // })
  }
}
