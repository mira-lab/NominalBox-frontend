import {Directive, OnInit, Input, ElementRef,} from '@angular/core';
import {CURRENCIES} from '../../create-page/currency/currency-list';

@Directive({
  selector: '[appCurrencyImage]'
})
export class CurrencyImageDirective implements OnInit {
  @Input('appCurrencyImage') currencySymbol: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    CURRENCIES.forEach((item) => {
      if (item.symbol === this.currencySymbol) {
        this.elementRef.nativeElement.src = item.icon;
      }
    });
  }

}
