import { Component, ViewChildren, QueryList, Input, AfterViewChecked } from '@angular/core';
import { FragmentedDomDirective } from '../../shared/directive/fragmented-dom.directive';
import { AbstractComponent } from '../../shared/abstract.component';
import { HighlightService } from '../../shared/services/highlight.service';

@Component({
  selector: 'app-fast-setup',
  templateUrl: './fast-setup.component.html',
  styleUrls: ['./fast-setup.component.scss']
})
export class FastSetupComponent extends AbstractComponent implements AfterViewChecked {
  @Input() doc: any;
  @ViewChildren(FragmentedDomDirective) fragments: QueryList<FragmentedDomDirective>;

  highlighted: boolean = false;
  fragmentsRef: {[key: string]: HTMLElement} = {};

  constructor(
    private highlightService: HighlightService
  ) {
    super();
  }

  public ngOnInit(): void {
  }
  public ngAfterViewChecked(): void {
    this.fragments.forEach((fragmentDom: FragmentedDomDirective) => {
      this.fragmentsRef[fragmentDom.fragment] = fragmentDom.element.nativeElement;
    });
    this.initializeDocs();
    if (!this.highlighted) {
      this.highlightService.highlightAll();
      this.highlighted = true;
    }
  }
  private initializeDocs(): void {
    // console.log(this.doc)
  }
  public highlightTheCode(code: string, langague: string): string {
    return code;
    // return this.highlightService.highlight(code, langague);
  }
}
