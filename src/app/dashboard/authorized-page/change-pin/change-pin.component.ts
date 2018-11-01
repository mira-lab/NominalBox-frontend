import {Component, OnInit, Input} from '@angular/core';

import {ChangePin} from './change-pin';
import {MiraBox} from '../../../mirabox/mirabox';
import {MiraboxService} from '../../../mirabox/mirabox.service';
import {ServerCommunicationService} from '../../../mirabox/server-communication.service';
import {ModalForm} from '../../../shared/modal-form';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.css'],
})
export class ChangePinComponent extends ModalForm implements OnInit {
  @Input() miraBox: MiraBox;
  formModel = new ChangePin('', '', '');

  constructor(private serverCommSvc: ServerCommunicationService,
              private miraBoxSvc: MiraboxService) {
    super();
  }

  ngOnInit() {
  }

  closeChangePin(): void {
    if (!this.formSubmitting) {
      this.closeModalForm();
      this.newFormModel();
    }
  }

  changePin(): void {
    this.resetAllEvents();
    this.formSubmitting = true;
    if (this.formModel.checkValid()) {
      this.serverCommSvc.changePin(this.formModel.oldPin,
        this.formModel.newPin,
        this.miraBox.getMiraBoxItems()[0].contract,
        this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey()))
        .then((res) => {
          console.log(res);
          this.showSuccessMessage();
          this.formSubmitting = false;
        })
        .catch((err) => {
          if (err.status && err.status === 404) {
            console.log('wrong pin');
            this.showErrorMessage('The PIN you have entered is invalid. Please try again.');
          } else {
            this.showErrorMessage('Oops! Something went wrong while submitting the form.');
          }
          this.formSubmitting = false;
        });
    } else {
      this.formSubmitting = false;
      this.showErrorMessage('Pin fields are empty or they don\'t match!');
    }
  }

  newFormModel(): void {
    this.formModel = new ChangePin('', '', '');
  }
}
