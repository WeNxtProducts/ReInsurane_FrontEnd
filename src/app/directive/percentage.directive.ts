import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[appPercentage]'
})
export class PercentageDirective {

  constructor(private el: ElementRef, private control: NgControl, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let value = event.target.value;

    value = value.replace(/[^0-9.]/g, '');

    if ((value.match(/\./g) || []).length > 1) {
      value = value.substring(0, value.lastIndexOf('.'));
    }

    let numericValue = parseFloat(value);
    if (numericValue > 100) {
      numericValue = 100;
    } else if (numericValue < 0 || isNaN(numericValue)) {
      numericValue = 0;
    }

    if (this.control && this.control.control) {
      this.control.control.setValue(numericValue, { emitEvent: false });
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'value', numericValue);
    }
  }
}
