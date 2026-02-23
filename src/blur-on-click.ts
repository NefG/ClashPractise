import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appBlurOnClick]',
})
export class BlurOnClick {
  constructor(private el: ElementRef) {}
  @HostListener('click')
  onClick() {
    this.el.nativeElement.blur();
  }
}
