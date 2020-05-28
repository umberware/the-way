import { Injectable, Inject } from '@angular/core';

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

  // public highlight(code: string, language: string): string {
  //   // console.log(Prism.highlight(code, Prism.languages.typescript))
  //   // console.log(Prism.languages)
  //   console.log(Prism)

  //   return Prism.highlight(code, Prism.languages[language]);
  // }
}