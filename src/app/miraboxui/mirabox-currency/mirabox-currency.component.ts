import {Component, OnInit, Input} from '@angular/core';
import {MiraBox} from '../mirabox';
import {CURRENCIES} from '../currency/currency-list';

@Component({
  selector: 'app-mirabox-currency',
  templateUrl: './mirabox-currency.component.html',
  styleUrls: ['./mirabox-currency.component.css']
})
export class MiraboxCurrencyComponent implements OnInit {
  @Input() miraBox: MiraBox;

  constructor() {
  }

  ngOnInit() {
  }

  nothing() {
  }
}
