import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currencyList;
  private currenciesSource = new BehaviorSubject([]);
  changeInCurrencies$ = this.currenciesSource.asObservable();

  constructor() {
  }

  changeInCurrencies(newCurrencies) {
    this.currencyList = newCurrencies;
    this.currenciesSource.next(newCurrencies);
  }
}
