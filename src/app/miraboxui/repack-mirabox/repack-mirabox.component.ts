import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MiraBox} from '../mirabox';
import {MiraboxService} from '../mirabox.service';
import {MiraboxDataService} from '../mirabox-data.service';
import {ServerCommunicationService} from '../server-communication.service';
import {RepackMiraboxService} from './repack-mirabox.service';
import {RepackMirabox} from './repack-mirabox';

@Component({
  selector: 'app-repack-mirabox',
  templateUrl: './repack-mirabox.component.html',
  styleUrls: ['./repack-mirabox.component.css']
})
export class RepackMiraboxComponent implements OnInit {
  @Input() miraBox: MiraBox;
  @Output() repackMiraBoxClosed = new EventEmitter<boolean>();
  errorMessage = 'Oops! Something went wrong while submitting the form.';
  isRepacking = false;
  showError = false;
  repackMiraBoxForm = new RepackMirabox(false, '', '');

  constructor(private miraBoxSvc: MiraboxService,
              private miraBoxDataSvc: MiraboxDataService,
              private serverCommSvc: ServerCommunicationService,
              private repackMiraBoxSvc: RepackMiraboxService) {
  }

  ngOnInit() {
  }

  // repackSendByEmail() {
  //   if (this.checkBox && !this.newEmail) {
  //     this.showErrorMessage('Email field can\'t be empty!');
  //     return;
  //   }
  //   this.miraBoxSvc.repackMiraBox(this.miraBox)
  //     .then((newMiraBox: MiraBox) => {
  //       this.miraBoxDataSvc.setMiraBox(newMiraBox);
  //       const miraBoxPublicKey = this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey());
  //       if (this.checkBox) {
  //         this.serverCommSvc.changeEmail(this.pin, this.pin, newMiraBox.getMiraBoxItems()[0].contract, this.newEmail, miraBoxPublicKey)
  //           .then(() => this.serverCommSvc.sendMiraBoxByEmail(newMiraBox, this.newEmail))
  //           .then(() => this.repackMiraBoxClosed.emit(true))
  //           .catch(err => console.log(err));
  //       } else {
  //         this.serverCommSvc.getEmail(miraBoxPublicKey, this.miraBox.getMiraBoxItems()[0].contract)
  //           .then((response: any) => {
  //             console.log('Got email from server.', response);
  //             return this.serverCommSvc.sendMiraBoxByEmail(newMiraBox, response._body.slice(1, response._body.length - 1));
  //           })
  //           .then((response: any) => {
  //             console.log('Got response from sendMiraBoxByEmail request', response);
  //             return this.repackMiraBoxClosed.emit(true);
  //           })
  //           .catch(err => console.log(err));
  //       }
  //     })
  //     .catch(err => {
  //       alert('Something went wrong with repacking mirabox!');
  //       console.log(err);
  //     });
  // }

  clickDownload() {
    try {
      this.repackMiraBoxForm.checkFormValid();
    } catch (err) {
      this.showErrorMessage(err);
      return;
    }
    this.isRepacking = true;
    if (this.repackMiraBoxForm.checkBox) {
      const CONTRACT = this.miraBox.getMiraBoxItems()[0].contract;
      const PUBKEY = this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey());
      this.serverCommSvc.checkPin(this.repackMiraBoxForm.pin, CONTRACT, PUBKEY)
        .then(() => {
          return this.repackChangeEmailAndDownload();
        })
        .catch((err) => {
          if (err.status && err.status === 404) {
            this.showErrorMessage('The PIN you have entered is invalid. Please try again.');
          } else {
            this.showErrorMessage('Oops! Something went wrong while submitting the form.');
          }
          this.isRepacking = false;
        });
    } else {
      this.repackAndDownload();
    }
  }

  clickSendByEmail() {
    try {
      this.repackMiraBoxForm.checkFormValid();
    } catch (err) {
      this.showErrorMessage(err);
      return;
    }
    this.isRepacking = true;
    if (this.repackMiraBoxForm.checkBox) {
      const CONTRACT = this.miraBox.getMiraBoxItems()[0].contract;
      const PUBKEY = this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey());
      this.serverCommSvc.checkPin(this.repackMiraBoxForm.pin, CONTRACT, PUBKEY)
        .then(() => {
          return this.repackChangeEmailAndSend();
        })
        .catch((err) => {
          if (err.status && err.status === 404) {
            this.showErrorMessage('The PIN you have entered is invalid. Please try again.');
          } else {
            this.showErrorMessage('Oops! Something went wrong while submitting the form.');
          }
          this.isRepacking = false;
        });
    } else {
      this.repackAndSendByEmail();
    }
  }

  repackAndDownload() {
    this.isRepacking = true;
    this.repackMiraBoxSvc.repack(this.miraBox)
      .then((newMiraBox: MiraBox) => {
        this.isRepacking = false;
        this.downloadMiraBox(newMiraBox);
        this.repackMiraBoxForm = new RepackMirabox(false, '', '');
        return this.repackMiraBoxClosed.emit(true);
      })
      .catch(err => {
        this.isRepacking = false;
        console.log('repackAndDownload error:', err);
        this.showErrorMessage();
      });
  }

  repackChangeEmailAndDownload() {
    this.isRepacking = true;
    this.repackMiraBoxSvc.repackAndChangeEmail(this.miraBox, this.repackMiraBoxForm.email, this.repackMiraBoxForm.pin)
      .then((newMiraBox: MiraBox) => {
        this.isRepacking = false;
        this.downloadMiraBox(newMiraBox);
        this.repackMiraBoxForm = new RepackMirabox(false, '', '');
        return this.repackMiraBoxClosed.emit(true);
      })
      .catch((err) => {
        this.isRepacking = false;
        console.log('repackChangeEmailAndDownload error:', err);
        this.showErrorMessage('Oops! Something went wrong with repacking MiraBox!');
      });

  }

  repackChangeEmailAndSend() {
    this.isRepacking = true;
    this.repackMiraBoxSvc.repackChangeEmailAndSend(this.miraBox, this.repackMiraBoxForm.email, this.repackMiraBoxForm.pin)
      .then(() => {
        this.isRepacking = false;
        this.repackMiraBoxForm = new RepackMirabox(false, '', '');
        return this.repackMiraBoxClosed.emit(true);
      })
      .catch((err) => {
        this.isRepacking = false;
        console.log('repackChangeEmailAndSend error:', err);
        this.showErrorMessage('Oops! Something went wrong with repacking MiraBox!');
      });
  }

  repackAndSendByEmail() {
    this.isRepacking = true;
    this.repackMiraBoxSvc.repackAndSendByEmail(this.miraBox)
      .then(() => {
        this.isRepacking = false;
        this.repackMiraBoxForm = new RepackMirabox(false, '', '');
        return this.repackMiraBoxClosed.emit(true);
      })
      .catch((err) => {
        this.isRepacking = false;
        console.log('repackAndSendByEmail error:', err);
        this.showErrorMessage('Oops! Something went wrong with repacking MiraBox!');
      });
  }

  downloadMiraBox(miraBox: MiraBox) {
    const data = 'data:application/text;charset=utf-8,' + miraBox.toString();
    const downloadAnchor = document.getElementById('download-mirabox');
    downloadAnchor.setAttribute('href', data);
    downloadAnchor.setAttribute('download', miraBox.getMiraBoxFileName());
    downloadAnchor.click();
  }

  showErrorMessage(error?: string) {
    if (error) {
      this.errorMessage = error;
    } else {
      this.errorMessage = 'Oops! Something went wrong with repacking MiraBox!'
    }
    this.showError = true;
  }


  closeWindow() {
    if (!this.isRepacking) {
      this.showError = false;
      this.errorMessage = 'Oops! Something went wrong with repacking MiraBox!';
      this.repackMiraBoxForm = new RepackMirabox(false, '', '');
      this.repackMiraBoxClosed.emit(false);
    }
  }

  resetErrorMessage() {
    this.errorMessage = 'Oops! Something went wrong while submitting the form.';
    this.showError = false;

  }
}
