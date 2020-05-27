import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  currentGuide$: BehaviorSubject<string>;
  currentSubGuide$: BehaviorSubject<string>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.currentGuide$ = new BehaviorSubject(this.route.snapshot.params.title);
    this.currentSubGuide$ = new BehaviorSubject(this.route.snapshot.fragment);
  }

  public getVisitorsCount(): Observable<any> {
    return this.http.get('/api/user/visitorsCount');
  }
}
