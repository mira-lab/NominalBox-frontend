import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

import {CURRENCIES} from './currency-list';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currencies = new BehaviorSubject(CURRENCIES);
  currentCurrencies = this.currencies.asObservable();

  constructor() {
  }

  changeInCurrencies(newCurrencies) {
    this.currencies.next(newCurrencies);
  }
}
