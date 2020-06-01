import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-the-way',
  templateUrl: './the-way.component.html',
  styleUrls: ['./the-way.component.scss']
})
export class TheWayComponent implements OnInit {

  @HostBinding('class') class = 'ui-flex';

  constructor() { }

  public ngOnInit(): void {}
}
