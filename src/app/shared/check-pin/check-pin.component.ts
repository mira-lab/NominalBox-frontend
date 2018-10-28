import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {MiraBox} from '../../mirabox/mirabox';
import {ServerCommunicationService} from '../../mirabox/server-communication.service';
import {MiraboxService} from '../../mirabox/mirabox.service';
import {ModalForm} from '../modal-form';
import {Router} from '@angular/router';

@Component({
  selector: 'app-check-pin',
  templateUrl: './check-pin.component.html',
  styleUrls: ['./check-pin.component.css']
})
export class CheckPinComponent extends ModalForm implements OnInit {

  @Input() miraBox: MiraBox;
  @Output() pinChecked = new EventEmitter<boolean>();
  pin = '';

  constructor(private miraBoxSvc: MiraboxService,
              private serverCommSvc: ServerCommunicationService,
              private router: Router) {
    super();
  }

  ngOnInit() {
  }

  checkPin() {
    if (!this.pin) {
      this.showErrorMessage('Pin field is empty!');
      return;
    }
    this.resetAllEvents();
    this.formSubmitting = true;
    const miraBoxPublicKey = this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey());
    this.serverCommSvc.checkPin(this.pin, this.miraBox.getMiraBoxItems()[0].contract, miraBoxPublicKey)
      .then((response) => {
        console.log(response);
        this.closeModalForm();
        this.router.navigate(['dashboard/authorized']);
      })
      .catch((err) => {
        if (err.status && err.status === 404) {
          this.showErrorMessage('The PIN you have entered is invalid. Please try again.');
        } else {
          this.showErrorMessage();
        }
        this.formSubmitting = false;
        console.log(err);
      });
  }

  closeCheckPin() {
    if (!this.formSubmitting) {
      this.pin = '';
      this.closeModalForm();
    }
  }
}
