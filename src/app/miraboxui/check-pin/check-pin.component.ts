import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MiraBox} from '../mirabox';
import {ServerCommunicationService} from '../server-communication.service';
import {MiraboxService} from '../mirabox.service';

@Component({
  selector: 'app-check-pin',
  templateUrl: './check-pin.component.html',
  styleUrls: ['./check-pin.component.css']
})
export class CheckPinComponent implements OnInit {

  @Input() miraBox: MiraBox;
  @Output() checkPinClosed = new EventEmitter<boolean>();
  @Output() pinChecked = new EventEmitter<boolean>();
  pin = '';
  isCheckingPin = false;
  showError = false;
  showSuccess = false;
  errorMessage = 'Oops! Something went wrong while submitting the form.';

  constructor(private miraBoxSvc: MiraboxService,
              private serverCommSvc: ServerCommunicationService) {
  }

  ngOnInit() {
  }

  checkPin() {
    if (!this.pin) {
      this.showErrorMessage('Pin field is empty!');
      return;
    }
    this.showError = false;
    this.isCheckingPin = true;
    this.serverCommSvc.checkPin(this.pin, this.miraBox.getMiraBoxItems()[0].contract, this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey()))
      .then((response) => {
        console.log(response);
        this.pinChecked.emit(true);
      })
      .catch((err) => {
      if (err.status && err.status === 404) {
        this.showErrorMessage('The PIN you have entered is invalid. Please try again.');
      } else {
        this.showErrorMessage('Oops! Something went wrong while submitting the form.');
      }
      this.isCheckingPin = false;
      console.log(err);
    });
  }

  closeCheckPin() {
    if (!this.isCheckingPin) {
      this.pin = '';
      this.checkPinClosed.emit(false);
      this.resetErrorMessage();
    }
  }

  showErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.showError = true;
  }

  resetErrorMessage() {
    this.errorMessage = 'Oops! Something went wrong while submitting the form.';
    this.showError = false;
  }

}
