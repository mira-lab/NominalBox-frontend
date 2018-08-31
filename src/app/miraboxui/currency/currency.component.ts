import {Component, OnInit} from '@angular/core';
import {PopUpSaveBoxService} from '../save-box/pop-up-save-box.service';
import {MiraboxService} from '../mirabox.service';
import { CURRENCIES } from './currency-list';
import {CurrencyService} from './currency.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  public currencies;
  constructor(private popUpSvc: PopUpSaveBoxService,
              private miraboxSvc: MiraboxService,
              private currencySvc: CurrencyService) {

  }

  ngOnInit() {
    this.currencies = CURRENCIES;
    this.currencies.forEach((currency) => {currency.added = false;});
  }

  showSaveBox() {
    this.popUpSvc.showPopUp();
  }

  changeInCurrencies() {
    this.currencySvc.changeInCurrencies(this.currencies);
  }

}
