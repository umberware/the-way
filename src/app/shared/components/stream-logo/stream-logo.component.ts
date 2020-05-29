import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-stream-logo',
  templateUrl: './stream-logo.component.html',
  styleUrls: ['./stream-logo.component.scss']
})
export class StreamLogoComponent implements OnInit {

  @Input() small: boolean;

  version: string;

  constructor(
    private appService: AppService
  ) {
    this.version = 'v' + this.appService.version;
  }

  ngOnInit(): void {
  }

}
