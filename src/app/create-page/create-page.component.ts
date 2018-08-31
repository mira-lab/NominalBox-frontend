import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyComponent} from '../miraboxui/currency/currency.component';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent implements OnInit {
  @ViewChild(CurrencyComponent)
  private currencyComponent: CurrencyComponent;


  constructor() {
  }

  ngOnInit() {
  }

}
