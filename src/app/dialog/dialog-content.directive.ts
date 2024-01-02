import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appDialogContent]',
})
export class DialogContentDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
