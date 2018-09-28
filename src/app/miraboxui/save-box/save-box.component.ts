import {Component, OnInit, Input} from '@angular/core';
import {PopUpSaveBoxService} from './pop-up-save-box.service';
import {Router} from '@angular/router';
import {MiraboxService} from '../mirabox.service';
import {CurrencyService} from '../currency/currency.service';
import {MiraBox} from '../mirabox';
import {MiraboxDataService} from '../mirabox-data.service';
import {ServerCommunicationService} from '../server-communication.service';
import {SaveBox} from './save-box';

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
   private miraBoxDataSvc: MiraboxDataService,
   private servercommSvc: ServerCommunicationService) {
  }
  @Input() mobile = false;
  saveBoxForm = new SaveBox('UntitledBox', '', '', '', '');
  miraboxCreating = false;
  currencies;
  show$;
  oopsShow = true;
  errorMessage = 'Oops! Something went wrong while submitting the form.';
  ngOnInit() {

    this.currencySvc.currentCurrencies.subscribe(currencies => this.currencies = currencies);
    this.show$ = this.popUpSvc.showPopUp$;
  }

  showErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.oopsShow = false;
  }

  resetErrorMessage() {
    this.errorMessage = 'Oops! Something went wrong while submitting the form.';
    this.oopsShow = true;
  }

  createMiraBox() {
    this.resetErrorMessage();
    this.miraboxCreating = true;
    return new Promise((resolve, reject) => {
      return this.miraBoxSvc.createMiraBox(this.currencies.filter(currency => currency.added === true), this.saveBoxForm.miraBoxTitle)
        .then((miraBox: MiraBox) => {
          return this.servercommSvc.addPin(this.saveBoxForm.pin, this.miraBoxSvc.getMiraBoxAddress(miraBox))
            .then((response) => {
              console.log(response);
              this.miraboxCreating = false;
              this.miraBoxDataSvc.setMiraBox(miraBox);
              return resolve(miraBox);
            });
        })
        .catch(err => {
          this.miraboxCreating = false;
          return reject(err);
        });
    });
  }
  newFormModel() {
    this.saveBoxForm = new SaveBox('UntitledBox', '', '', '', '');
  }
  navigateSendByEmail() {
    console.log("navigateSendByEmail");
    try {
      this.saveBoxForm.checkFormValid();
    } catch (err) {
      this.showErrorMessage(err);
      return;
    }
    this.createMiraBox()
      .then((miraBox: MiraBox) => {
        return this.servercommSvc.sendMiraBoxByEmail(miraBox, this.saveBoxForm.email);
      })
      .then(() => {
        return this.router.navigate(['dashboard-authorized']);
      })
      .catch((err) => {
        this.newFormModel();
        alert('Error while creating mirabox!');
        console.log(err);
      });
  }

  navigateDownload() {
    try {
      this.saveBoxForm.checkFormValid();
    } catch (err) {
      this.showErrorMessage(err);
      return;
    }
    this.createMiraBox()
      .then((miraBox: MiraBox) => {
        this.downloadMiraBox(miraBox);
        return this.router.navigate(['dashboard-authorized']);
      })
      .catch((err) => {
        this.newFormModel();
        alert('Error while creating mirabox!');
        console.log(err);
      });
  }

  downloadMiraBox(miraBox: MiraBox) {
    const data = 'data:application/text;charset=utf-8,' + miraBox.toString();
    const downloadAnchor = document.getElementById('download-mirabox');
    downloadAnchor.setAttribute('href', data);
    downloadAnchor.setAttribute('download', miraBox.getMiraBoxFileName());
    downloadAnchor.click();
  }

  closePopUp() {
    this.newFormModel();
    this.oopsShow = true;
    this.popUpSvc.closePopUp();
  }

}
