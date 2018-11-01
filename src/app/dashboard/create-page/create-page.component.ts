import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {CurrencyComponent} from './currency/currency.component';
import {MiraboxDataService} from '../../mirabox/mirabox-data.service';
import {MiraBox} from '../../mirabox/mirabox';
import {MiraboxService} from '../../mirabox/mirabox.service';
import {CurrencyService} from './currency/currency.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent implements OnInit {
  @ViewChild(CurrencyComponent)
  private currencyComponent: CurrencyComponent;
  showCheckPin = false;
  showSaveBox = false;
  miraBox: MiraBox;

  constructor(private router: Router,
              private miraBoxDataSvc: MiraboxDataService,
              private miraBoxSvc: MiraboxService,
              private currencySvc: CurrencyService) {
  }

  ngOnInit() {}
  onFileContentReceived(fileContent: string): any {
    try {
      this.miraBox = MiraBox.fromString(fileContent);
      this.miraBoxDataSvc.setMiraBox(this.miraBox);
      this.miraBoxSvc.isMiraboxItemOpened(this.miraBox, this.miraBox.getMiraBoxItems()[0])
        .then((res) => {
          if (res) {
            this.showCheckPin = true;
          } else {
            return this.router.navigate(['dashboard/authorized']);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      return alert('Bad MiraBox File!');
    }
  }
  showSB(): void {
    if (this.currencySvc.currencyList && this.currencySvc.currencyList.length > 0) {
      this.showSaveBox = true;
    } else {
      alert('You must choose at least 1 currency!');
    }
  }
}
