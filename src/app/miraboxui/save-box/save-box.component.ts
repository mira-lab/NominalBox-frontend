import {Component, OnInit} from '@angular/core';
import {PopUpSaveBoxService} from './pop-up-save-box.service';
import {Router} from '@angular/router';
import {MiraboxService} from '../mirabox.service';
import {CurrencyService} from '../currency/currency.service';
import {MiraBox} from '../mirabox';
import {MiraboxDataService} from '../mirabox-data.service';

@Component({
  selector: 'app-save-box',
  templateUrl: './save-box.component.html',
  styleUrls: ['./save-box.component.css']
})
export class SaveBoxComponent implements OnInit {

  constructor
  (private popUpSvc: PopUpSaveBoxService,
   private router: Router,
   private miraBoxSvc: MiraboxService,
   private currencySvc: CurrencyService,
   private miraBoxDataSvc: MiraboxDataService) {
  }
  miraboxCreating = false;
  miraBoxTitle = 'Untitled Box';
  currencies;
  show$;

  ngOnInit() {
    this.currencySvc.currentCurrencies.subscribe(currencies => this.currencies = currencies);
    this.show$ = this.popUpSvc.showPopUp$;
  }

  navigateDownload() {
    this.miraboxCreating = true;
    return this.miraBoxSvc.createMiraBox(this.currencies.filter(currency => currency.added === true), this.miraBoxTitle)
      .then((miraBox: MiraBox) => {
        this.miraBoxDataSvc.setMiraBox(miraBox);
        this.downloadMiraBox(miraBox);
        this.miraboxCreating = false;
        return this.router.navigate(['dashboard-authorized']);
      })
      .catch(err => {
        this.miraboxCreating = false;
        console.log(err);
        alert('Error while creating mirabox!');
      });
  }

  downloadMiraBox(miraBox: MiraBox) {
    const data = 'data:application/text;charset=utf-8,' + miraBox.toString();
    const downloadAnchor = document.getElementById('download-mirabox');
    downloadAnchor.setAttribute('href', data);
    downloadAnchor.setAttribute('download', miraBox.getMiraBoxFileName());
    downloadAnchor.click();
  }

  navigateEmail() {

  }

  showPopUp() {
    this.popUpSvc.showPopUp();
  }

  closePopUp() {
    this.popUpSvc.closePopUp();
  }

}
