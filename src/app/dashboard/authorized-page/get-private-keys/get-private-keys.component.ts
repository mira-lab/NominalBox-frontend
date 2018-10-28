import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';

import {MiraBox} from '../../../mirabox/mirabox';
import {MiraboxService} from '../../../mirabox/mirabox.service';
import {ModalForm} from '../../../shared/modal-form';
import {ServerCommunicationService} from '../../../mirabox/server-communication.service';

@Component({
  selector: 'app-get-private-keys',
  templateUrl: './get-private-keys.component.html',
  styleUrls: ['./get-private-keys.component.css']
})
export class GetPrivateKeysComponent extends ModalForm implements OnInit {
  @Input() miraBox: MiraBox;
  @Input() parentSubject: Subject<any>;
  @Output() gotPrivateKey = new EventEmitter<string>();
  pin = '';

  constructor(private miraBoxSvc: MiraboxService,
              private serverCommSvc: ServerCommunicationService) {
    super();
  }

  ngOnInit() {
  }

  getPrivateKeys() {
    if (!this.pin) {
      this.showErrorMessage('Pin field is empty!');
      return;
    }
    this.showError = false;
    this.formSubmitting = true;
    this.serverCommSvc.openMiraBox(this.miraBox, this.pin, this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey()))
      .then((response) => {
        console.log(response);
        this.miraBoxSvc.openMiraBox(this.miraBox)
          .then((pk: string) => {
            this.gotPrivateKey.emit(pk);
            this.parentSubject.next('update_last_actions');
            this.formSubmitting = false;
            this.closeGetPrivateKeys();
          })
          .catch((err) => {
            this.showErrorMessage('Oops! Something went wrong while opening MiraBox.');
            this.formSubmitting = false;
            console.log(err);
          });
      }).catch((err) => {
      if (err.status && err.status === 404) {
        this.showErrorMessage('The PIN you have entered is invalid. Please try again.');
      } else {
        this.showErrorMessage('Oops! Something went wrong while submitting the form.');
      }
      this.formSubmitting = false;
      console.log(err);
    });
  }

  closeGetPrivateKeys() {
    if (!this.formSubmitting) {
      this.pin = '';
      this.closeModalForm();
    }
  }
}
