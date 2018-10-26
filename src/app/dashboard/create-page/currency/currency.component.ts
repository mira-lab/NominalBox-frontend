import {Component, OnInit} from '@angular/core';

import {PopUpSaveBoxService} from '../save-box/pop-up-save-box.service';
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
  constructor(private popUpSvc: PopUpSaveBoxService,
              private miraboxSvc: MiraboxService,
              private currencySvc: CurrencyService) {

  }

  ngOnInit() {
    this.currencies = CURRENCIES;
    this.inactiveCurrencies = INACTIVECURRENCIES;
    this.currencies.forEach((currency) => {
      currency.added = false;
    });
  }

  showSaveBox() {
    if (this.currencies.filter((curr) => curr.added === true).length > 0) {
      this.popUpSvc.showPopUp();
    } else {
      alert('You must choose at least 1 currency!');
    }
  }

  changeInCurrencies() {
    this.currencySvc.changeInCurrencies(this.currencies);
  }

}
