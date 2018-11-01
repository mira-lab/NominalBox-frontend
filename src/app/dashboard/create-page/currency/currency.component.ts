import {Component, OnInit} from '@angular/core';

import {MiraboxService} from '../../../mirabox/mirabox.service';
import {CURRENCIES, INACTIVECURRENCIES} from './currency-list';
import {CurrencyService} from './currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  public currencies;
  public inactiveCurrencies;
  constructor(private miraboxSvc: MiraboxService,
              private currencySvc: CurrencyService) {

  }

  ngOnInit() {
    this.currencies = CURRENCIES;
    this.inactiveCurrencies = INACTIVECURRENCIES;
    this.currencies.forEach((currency) => {
      currency.added = false;
    });
  }

  changeInCurrencies(): void {
    this.currencySvc.changeInCurrencies(this.currencies.filter(currency => currency.added));
  }

}
