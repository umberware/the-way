import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  actualDoc$: BehaviorSubject<any> = new BehaviorSubject(null);
  actualGuideDoc$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }
}
