import { Component, OnInit, HostBinding } from '@angular/core';

import { LinkModel } from '../shared/components/link/link.model';
import { SOCIAL_LINKS } from '../social-links';

@Component({
  selector: 'app-the-way',
  templateUrl: './the-way.component.html',
  styleUrls: ['./the-way.component.scss']
})
export class TheWayComponent implements OnInit {

  @HostBinding('class') class = 'ui-flex';

  links: Array<LinkModel> = SOCIAL_LINKS

  constructor() { }

  public ngOnInit(): void {}
}
