import { Component, ViewChildren, QueryList, Input, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FragmentedDomDirective } from '../../shared/directive/fragmented-dom.directive';
import { AbstractComponent } from '../../shared/abstract.component';
import { HighlightService } from '../../shared/services/highlight.service';
@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent extends AbstractComponent implements AfterViewInit {
  @Input() doc: any;
  @ViewChildren(FragmentedDomDirective) fragments: QueryList<FragmentedDomDirective>;

  ready: boolean = false;

  actualFrament: string;
  highlighted: boolean = false;
  fragmentsRef: {[key: string]: HTMLElement} = {};

  constructor(
    private highlightService: HighlightService,
    private route: ActivatedRoute,
    private router: Router,
    private elRef: ElementRef
  ) {
    super();
  }

  public ngOnInit(): void {
  }
  public ngAfterViewInit(): void {
    this.fragments.forEach((fragmentDom: FragmentedDomDirective) => {
      const native: HTMLElement = fragmentDom.element.nativeElement;
      const appNative: HTMLElement = this.elRef.nativeElement;
      
      if (!this.fragmentsRef[native.id]) {
        this.fragmentsRef[native.id] = native;
      }
      if (this.isFragmentTerritory(native, appNative) && this.actualFrament != native.id) {
        this.actualFrament = native.id;
        this.router.navigate([], {
          relativeTo: this.route,
          fragment: this.actualFrament
        })
      }
    });
    if (!this.highlighted) {
      this.highlightService.highlightAll();
      this.highlighted = true;
    }
    this.subscriptions$.add(this.route.fragment.subscribe((fragment: string) => {
      if (fragment && fragment !== this.actualFrament) {
        const fragmentRef = this.fragmentsRef[fragment];
        fragmentRef.scrollIntoView();
        this.actualFrament = fragment;
      }
    }));
  }
  public highlightTheCode(code: string, langague: string): string {
    return code;
  }
  private isFragmentTerritory(native: HTMLElement, appNative: HTMLElement): boolean {
    return appNative.scrollTop >=  native.offsetTop && appNative.scrollTop <= native.offsetTop + native.offsetHeight
  }
}
