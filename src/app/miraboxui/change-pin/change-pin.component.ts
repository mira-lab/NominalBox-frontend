import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ServerCommunicationService} from '../server-communication.service';
import {ChangePin} from './change-pin';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.css']
})
export class ChangePinComponent implements OnInit {
  @Input() miraBoxAddress: string;
  @Output() changePinClosed = new EventEmitter<boolean>();

  formModel = new ChangePin('', '', '', '');
  showError = false;
  showErrorPin = false;
  showSuccess = false;

  constructor(private serverCommSvc: ServerCommunicationService) {
  }

  ngOnInit() {
  }

  closeChangePin() {
    this.resetAllEvents();
    this.newFormModel();
    this.changePinClosed.emit(false);
  }

  changePin() {
    this.resetAllEvents();
    if (this.formModel.checkValid()) {
      this.serverCommSvc.changePin(this.formModel.oldPin, this.formModel.newPin, this.miraBoxAddress)
        .then((res) => {
          console.log(res);
          this.showSuccess = true;
        })
        .catch((err) => {
          console.log(err);
          this.showError = true;
        });
    } else {
      this.showErrorPin = true;
    }
  }

  newFormModel() {
    this.formModel = new ChangePin('', '', '', '');
  }

  resetErrorPin() {
    this.showErrorPin = false;
  }

  resetAllEvents() {
    this.showError = false;
    this.showSuccess = false;
    this.showErrorPin = false;
  }
}
