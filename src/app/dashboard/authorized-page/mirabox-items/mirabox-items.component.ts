import {Component, OnInit, Input} from '@angular/core';

import {MiraBox} from '../../../mirabox/mirabox';
import {CURRENCIES} from '../../create-page/currency/currency-list';
import {PubkeyToAddressService} from './pubkey-to-address.service';

@Component({
  selector: 'app-mirabox-items',
  templateUrl: './mirabox-items.component.html',
  styleUrls: ['./mirabox-items.component.css'],
  providers: [PubkeyToAddressService]
})
export class MiraboxItemsComponent implements OnInit {
  @Input() miraBox: MiraBox;
  @Input() privateKey;
  miraBoxItemsUI: any;

  constructor(private pubToAddressSvc: PubkeyToAddressService) {
  }

  ngOnInit() {
    this.miraBoxItemsUI = this.makeMiraBoxItemsForUI();
  }
  makeMiraBoxItemsForUI(): any {
    return this.miraBox.getMiraBoxItems().map((item) => {
      return {
        currencySymbol: item.currency,
        address: this.pubToAddressSvc.publicKeyToAddress(item.currency, item.address),
        currencyImage: CURRENCIES.find(currency => currency.symbol === item.currency).icon,
        currencyName: CURRENCIES.find(currency => currency.symbol === item.currency).name
      };
    });
  }
}
