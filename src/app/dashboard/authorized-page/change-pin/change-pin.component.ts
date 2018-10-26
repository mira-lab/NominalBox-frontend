import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ServerCommunicationService} from '../../../mirabox/server-communication.service';
import {ChangePin} from './change-pin';
import {MiraBox} from '../../../mirabox/mirabox';
import {MiraboxService} from '../../../mirabox/mirabox.service';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.css']
})
export class ChangePinComponent implements OnInit {
  @Input() miraBox: MiraBox;
  @Output() changePinClosed = new EventEmitter<boolean>();

  formModel = new ChangePin('', '', '');
  showError = false;
  showSuccess = false;
  changePinPosting = false;
  errorMessage = 'Oops! Something went wrong while submitting the form.';

  constructor(private serverCommSvc: ServerCommunicationService,
              private miraBoxSvc: MiraboxService) {
  }

  ngOnInit() {
  }

  closeChangePin() {
    if (!this.changePinPosting) {
      this.resetAllEvents();
      this.newFormModel();
      this.changePinClosed.emit(false);
    }
  }

  changePin() {
    this.resetAllEvents();
    this.changePinPosting = true;
    if (this.formModel.checkValid()) {
      this.serverCommSvc.changePin(this.formModel.oldPin,
        this.formModel.newPin,
        this.miraBox.getMiraBoxItems()[0].contract,
        this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey()))
        .then((res) => {
          console.log(res);
          this.showSuccess = true;
          this.changePinPosting = false;
        })
        .catch((err) => {
          if (err.status && err.status === 404) {
            console.log('wrong pin');
            this.showErrorMessage('The PIN you have entered is invalid. Please try again.');
          } else {
            this.showErrorMessage('Oops! Something went wrong while submitting the form.');
          }
          this.changePinPosting = false;
        });
    } else {
      this.changePinPosting = false;
      this.showErrorMessage('Pin fields are empty or they don\'t match!');
    }
  }

  newFormModel() {
    this.formModel = new ChangePin('', '', '');
  }

  resetAllEvents() {
    this.resetErrorMessage();
    this.showSuccess = false;
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
