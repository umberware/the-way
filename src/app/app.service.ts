import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  version: string;
  guides$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  guidesDocs$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  guidesStates$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedVersion$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private http: HttpClient
  ) {}

  public getVisitorsCount(): Observable<any> {
    return this.http.get('/api/user/visitorsCount');
  }
}
