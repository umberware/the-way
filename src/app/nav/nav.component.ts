import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SOCIAL_LINKS } from '../social-links';
import { LinkModel } from '../shared/components/link/link.model';
import { AppService } from '../app.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() systemName: string;
  @Input() version: string;

  links: Array<LinkModel> = SOCIAL_LINKS;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public appService: AppService
  ) {}

  public ngOnInit(): void {}
  
  public eventNavigateToHome(): void {
    this.router.navigate(['/']);
  }
}
