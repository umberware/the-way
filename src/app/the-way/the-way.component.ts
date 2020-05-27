import { Component, OnInit } from '@angular/core';

import { LinkModel } from '../shared/link/link.model';
import { SOCIAL_LINKS } from '../social-links';

@Component({
  selector: 'app-the-way',
  templateUrl: './the-way.component.html',
  styleUrls: ['./the-way.component.scss']
})
export class TheWayComponent implements OnInit {

  links: Array<LinkModel> = SOCIAL_LINKS

  constructor() { }

  public ngOnInit(): void {}
}
