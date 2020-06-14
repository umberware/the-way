import { Component, ElementRef, AfterViewChecked, ViewChildren, QueryList, HostListener, Output, EventEmitter } from '@angular/core';

import { AbstractComponent } from '../../shared/abstract.component';
import { GuideService } from '../guide.service';
import { FragmentedDomDirective } from '../../shared/directive/fragmented-dom.directive';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { HighlightService } from '../../shared/services/highlight.service';

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent extends AbstractComponent implements AfterViewChecked{
  @ViewChildren(FragmentedDomDirective) fragments: QueryList<FragmentedDomDirective>;
  @Output() viewingDocument: EventEmitter<string> = new EventEmitter();

  private automaticScrool: boolean = false;
  public documentsChanged: boolean = false;
  public selectedGuide: any;
  private selectedSubStateGuide: string;
  private fragmentsView: Array<ElementRef>;

  private ready$ = new BehaviorSubject<boolean>(false);

  constructor(
    private guideService: GuideService,
    private element: ElementRef,
    private highlightService: HighlightService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.watchState();
  }
  public ngAfterViewChecked(): void {
    if (!this.ready$.getValue()) {
      this.collectDocs();
    }
  }
  public collectDocs(): void {
    this.fragmentsView = this.fragments.toArray();
    this.fragmentsView.forEach((element: ElementRef) => {
      (element.nativeElement as HTMLElement).querySelectorAll('code').forEach((codeBlock) => {
        this.highlightService.highlightBlock(codeBlock);
      });
    });
    this.ready$.next(true);
  }
  @HostListener('scroll', ['$event'])
  public eventScroll(event: any): void {
    if (this.automaticScrool) {
      this.automaticScrool = false;
      return;
    }

    this.fragmentsView.forEach((fragment: FragmentedDomDirective) => {
      const native: HTMLElement = fragment.element.nativeElement;
      const appNative: HTMLElement = this.element.nativeElement;
      if (this.isFragmentTerritory(native, appNative) && this.selectedSubStateGuide !== native.id) {
        this.selectedSubStateGuide = native.id;
        this.viewingDocument.emit(native.id);
      }
    });
  }
  private isFragmentTerritory(native: HTMLElement, appNative: HTMLElement): boolean {
    return (appNative.scrollTop + window.innerHeight/2) >= native.offsetTop && appNative.scrollTop <= native.offsetTop + native.offsetHeight - (window.innerHeight/2);
  }
  public scrollTo(): void {
    this.automaticScrool = true;

    if (this.selectedSubStateGuide === null) {
      const htmlRef = this.element.nativeElement as HTMLElement;
      htmlRef.scrollTo({top: 0})
      return;
    }

    const fragmentRef: ElementRef = this.fragmentsView.find((view: ElementRef) => {
      return view.nativeElement.id === this.selectedSubStateGuide;
    });
    if (fragmentRef) {
      const htmlRef = fragmentRef.nativeElement
      htmlRef.scrollIntoView();
    }
  }
  public watchState(): void {
    this.subscriptions$.add(this.guideService.actualGuide$.subscribe(
      (guide: any) => {
        this.selectedGuide = guide;
        this.ready$.next(false);
      }
    ));
    this.subscriptions$.add(
      this.ready$.pipe(filter((ready: boolean) => ready), switchMap(() => {
        return this.guideService.actualSubGuideState$;
      })).subscribe(
      (subGuideState: any) => {
        if (subGuideState === null) {
          this.selectedSubStateGuide = null;
          this.scrollTo();
        }
        else if (subGuideState !== null && subGuideState.name !== this.selectedSubStateGuide) {
          this.selectedSubStateGuide = subGuideState.name;
          this.scrollTo();
        } else if (subGuideState !== this.selectedSubStateGuide) {
          this.selectedSubStateGuide = null;
        }
      }
    ));
  }
}
