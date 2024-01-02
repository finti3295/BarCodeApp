import {
    Component,
    ContentChild,
    ElementRef,
    HostListener,
    Input,
    ViewChild,
    ViewContainerRef,
  } from '@angular/core';
  import { DialogContentDirective } from './dialog-content.directive';
  import { DialogFooterDirective } from './dialog-footer.directive';
  import { DialogHeaderDirective } from './dialog-header.directive';
  
  @Component({
    selector: '[appDialog]',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
  })
  export class DialogComponent {
    @ContentChild(DialogContentDirective) content: DialogContentDirective;
    @ContentChild(DialogHeaderDirective) header: DialogHeaderDirective;
    @ContentChild(DialogFooterDirective) footer: DialogFooterDirective;
  
    @ViewChild('contentVcr', { read: ViewContainerRef, static: true })
    private contentVcr: ViewContainerRef;
  
    @ViewChild('headerVcr', { read: ViewContainerRef, static: true })
    private headerVcr: ViewContainerRef;
  
    @ViewChild('footerVcr', { read: ViewContainerRef, static: true })
    private footerVcr: ViewContainerRef;
  
    @Input() title: string;
  
    constructor(private host: ElementRef) {}
  
    showModal() {
      this.host.nativeElement.showModal();
      this.contentVcr.createEmbeddedView(this.content.tpl);
      this.header?.tpl && this.headerVcr.createEmbeddedView(this.header.tpl);
      this.footer?.tpl && this.footerVcr.createEmbeddedView(this.footer.tpl);
    }
  
    close() {
      this.element.addEventListener(
        'animationend',
        (e: AnimationEvent) => {
          if (e.animationName === 'fadeOut') {
            this.element.close();
            this.clear();
            this.element.removeAttribute('closing');
          }
        },
        { once: true }
      );
  
      this.element.setAttribute('closing', 'true');
  
      // this.element.close();
      // this.clear();
    }
  
    private get element() {
      return this.host.nativeElement;
    }
  
    private clear() {
      this.contentVcr.clear();
      this.footerVcr.clear();
      this.headerVcr.clear();
    }
  
    @HostListener('click', ['$event'])
    onDialogClick(event: MouseEvent) {
      if ((event.target as any).nodeName === 'DIALOG') {
        this.close();
      }
    }
  
    @HostListener('cancel')
    onDialogCancel() {
      this.clear();
    }
  }
  