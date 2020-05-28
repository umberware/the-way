import { Component, OnInit, Input } from '@angular/core';
import { LinkModel } from './link.model';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  @Input() links: Array<LinkModel>;

  constructor() { }

  ngOnInit(): void {
  }

}
