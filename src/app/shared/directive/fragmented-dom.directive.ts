import { Directive, ElementRef } from '@angular/core';
import { element } from 'protractor';

@Directive({
  selector: '[fragmented-dom]'
})
export class FragmentedDomDirective {
  nativeElement: HTMLElement;
  
  constructor(public element: ElementRef) {
    this.nativeElement = element.nativeElement
  }
}