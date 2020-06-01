import { Injectable } from '@angular/core';

import hljs from 'highlight.js';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('javascript', json);
hljs.registerLanguage('typescript', typescript);

@Injectable({
  providedIn: 'root'
})
export class HighlightService {

  constructor() {}

  public highlightAll(): void {
    hljs.initHighlightingOnLoad();
  }
  public highlightBlock(block: HTMLElement): void {
    hljs.highlightBlock(block);
  }
}