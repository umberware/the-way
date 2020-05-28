import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[fragmented-dom]'
})
export class FragmentedDomDirective {
    fragment: string;
    constructor(public element: ElementRef) {
        this.fragment = (element.nativeElement as HTMLElement).getAttribute('data-fragment');
    }
}