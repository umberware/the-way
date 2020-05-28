import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stream-logo',
  templateUrl: './stream-logo.component.html',
  styleUrls: ['./stream-logo.component.scss']
})
export class StreamLogoComponent implements OnInit {

  @Input() small: boolean;

  version: string = 'v0.5.0'

  constructor() { }

  ngOnInit(): void {
  }

}
