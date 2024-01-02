import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appDialogHeader]',
})
export class DialogHeaderDirective {
  constructor(public tpl: TemplateRef<any>) {}
}
