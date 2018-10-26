import {Component, OnInit, Input} from '@angular/core';
import {MiraBox} from '../../../mirabox/mirabox';
import {CURRENCIES} from '../../create-page/currency/currency-list';
import {PubkeyToAddressService} from '../../../mirabox/pubkey-to-address.service';

@Component({
  selector: 'app-mirabox-currency',
  templateUrl: './mirabox-currency.component.html',
  styleUrls: ['./mirabox-currency.component.css']
})
export class MiraboxCurrencyComponent implements OnInit {
  @Input() miraBox: MiraBox;
  @Input() privateKey;
  miraBoxShowObj;

  constructor(private pubToAddressSvc: PubkeyToAddressService) {
  }

  ngOnInit() {
    if (this.miraBox) {
      this.miraBoxShowObj = this.miraBox.getMiraBoxItems().map((item) => {
        return {
          currencySymbol: item.currency,
          address: this.pubToAddressSvc.publicKeyToAddress(item.currency, item.address),
          currencyImage: CURRENCIES.find(currency => currency.symbol === item.currency).icon,
          currencyName: CURRENCIES.find(currency => currency.symbol === item.currency).name
        };
      });
    }
  }

  nothing() {
  }
}
