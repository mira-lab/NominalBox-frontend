import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import {MiraBox} from '../mirabox';
import {MiraboxService} from '../mirabox.service';
import {Subject} from 'rxjs';
import {ServerCommunicationService} from '../server-communication.service';

@Component({
  selector: 'app-get-private-keys',
  templateUrl: './get-private-keys.component.html',
  styleUrls: ['./get-private-keys.component.css']
})
export class GetPrivateKeysComponent implements OnInit {
  @Input() miraBox: MiraBox;
  @Input() parentSubject: Subject<any>;
  @Output() getPrivateKeysClosed = new EventEmitter<boolean>();
  @Output() gotPrivateKey = new EventEmitter<string>();
  pin = '';
  isGettingPrivateKeys = false;
  showError = false;
  showSuccess = false;
  errorMessage = 'Oops! Something went wrong while submitting the form.';

  constructor(private miraBoxSvc: MiraboxService,
              private serverCommSvc: ServerCommunicationService) {
  }

  ngOnInit() {
  }

  getPrivateKeys() {
    if (!this.pin) {
      this.showErrorMessage('Pin field is empty!');
      return;
    }
    this.showError = false;
    this.isGettingPrivateKeys = true;
    this.serverCommSvc.openMiraBox(this.miraBox, this.pin, this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey())).then((response) => {
      console.log(response);
      this.miraBoxSvc.openMiraBox(this.miraBox)
        .then((pk: string) => {
          this.gotPrivateKey.emit(pk);
          this.parentSubject.next('update_last_actions');
          this.isGettingPrivateKeys = false;
          this.closeGetPrivateKeys();
        })
        .catch((err) => {
          this.showErrorMessage('Oops! Something went wrong while opening mirabox.');
          this.isGettingPrivateKeys = false;
          console.log(err);
        });
    }).catch((err) => {
      if (err.status && err.status === 404) {
        this.showErrorMessage('Wrong pin!');
      } else {
        this.showErrorMessage('Oops! Something went wrong while submitting the form.');
      }
      this.isGettingPrivateKeys = false;
      console.log(err);
    });
  }

  closeGetPrivateKeys() {
    if (!this.isGettingPrivateKeys) {
      this.pin = '';
      this.getPrivateKeysClosed.emit(false);
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
