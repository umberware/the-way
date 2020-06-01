import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  actualGuide$: BehaviorSubject<any> = new BehaviorSubject(null);
  actualSubGuideState$: BehaviorSubject<any> = new BehaviorSubject(null);
  actualGuideDoc$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }
}
