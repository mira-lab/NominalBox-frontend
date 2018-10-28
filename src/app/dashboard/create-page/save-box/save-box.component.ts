import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';

import {CurrencyService} from '../currency/currency.service';
import {MiraboxService} from '../../../mirabox/mirabox.service';
import {MiraBox} from '../../../mirabox/mirabox';
import {MiraboxDataService} from '../../../mirabox/mirabox-data.service';
import {ServerCommunicationService} from '../../../mirabox/server-communication.service';
import {SaveBox} from './save-box';
import {ModalForm} from '../../../shared/modal-form';

@Component({
  selector: 'app-save-box',
  templateUrl: './save-box.component.html',
  styleUrls: ['./save-box.component.css']
})
export class SaveBoxComponent extends ModalForm implements OnInit {

  constructor
  (private router: Router,
   private miraBoxSvc: MiraboxService,
   private currencySvc: CurrencyService,
   private miraBoxDataSvc: MiraboxDataService,
   private servercommSvc: ServerCommunicationService) {
    super();
  }

  @Input() mobile = false;
  saveBoxForm = new SaveBox('UntitledBox', '', '', '', '');
  currencies;

  ngOnInit() {
    this.currencies = this.currencySvc.currencyList;
    this.currencySvc.changeInCurrencies$.subscribe(currencies => this.currencies = currencies);
  }


  createMiraBox() {
    this.resetAllEvents();
    this.formSubmitting = true;
    return new Promise((resolve, reject) => {
      // Create mirabox
      return this.miraBoxSvc.createMiraBox(this.currencies, this.saveBoxForm.miraBoxTitle)
        .then((miraBox: MiraBox) => {
          const contractAddress = miraBox.getMiraBoxItems()[0].contract;
          const miraBoxAddress = this.miraBoxSvc.getMiraBoxAddress(miraBox);
          // Post request to set pin
          return this.servercommSvc.setPin(this.saveBoxForm.pin, this.saveBoxForm.email, contractAddress, miraBoxAddress)
            .then((response: any) => {
              console.log('Response address:' + response._body.slice(1, response._body.length - 1));
              // Transaction to contract to add 2 factor with response address
              return this.miraBoxSvc.add2fa(miraBox, response._body.slice(1, response._body.length - 1));
            })
            .then(() => this.miraBoxSvc.changeMiraBoxItemReceiver(miraBox, miraBox.getMiraBoxItems()[0]))
            .then((add2faReceipt) => {
              console.log('Got receipt from add2fa. Receipt:');
              console.log(add2faReceipt);
              // Set mirabox to service for later use, stop creating animation
              this.formSubmitting = false;
              this.miraBoxDataSvc.setMiraBox(miraBox);
              return resolve(miraBox);
            });
        })
        .catch(err => {
          this.formSubmitting = false;
          return reject(err);
        });
    });
  }

  newFormModel() {
    this.saveBoxForm = new SaveBox('UntitledBox', '', '', '', '');
  }

  navigateSendByEmail() {
    try {
      this.saveBoxForm.checkFormValid();
    } catch (err) {
      this.showErrorMessage(err);
      return;
    }
    this.createMiraBox()
      .then((miraBox: MiraBox) => {
        this.servercommSvc.sendMiraBoxByEmail(miraBox, this.saveBoxForm.email);
      })
      .then(() => {
        return this.router.navigate(['dashboard/authorized']);
      })
      .catch((err) => {
        this.newFormModel();
        alert('Error while creating MiraBox!');
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
        return this.router.navigate(['dashboard/authorized']);
      })
      .catch((err) => {
        this.newFormModel();
        alert('Error while creating MiraBox!');
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

  closeSaveBox() {
    this.newFormModel();
    this.closeModalForm();
  }

}
