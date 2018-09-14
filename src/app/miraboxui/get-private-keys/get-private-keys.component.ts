import {Component, Input, EventEmitter, OnInit, Output} from '@angular/core';
import {MiraBox} from '../mirabox';
import {MiraboxService} from '../mirabox.service';
import {Subject} from 'rxjs';

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
  showErrorPin = false;
  showSuccess = false;

  constructor(private miraBoxSvc: MiraboxService) {
  }

  ngOnInit() {
  }

  getPrivateKeys() {
    if (!this.pin) {
      this.showErrorPin = true;
      return;
    }
    this.showError = false;
    this.isGettingPrivateKeys = true;
    this.miraBoxSvc.openMiraBox(this.miraBox)
      .then((pk: string) => {
        this.gotPrivateKey.emit(pk);
        this.parentSubject.next('update_last_actions');
        this.isGettingPrivateKeys = false;
        this.closeGetPrivateKeys();
      })
      .catch((err) => {
        this.showError = true;
        console.log(err);
      });
  }

  closeGetPrivateKeys() {
    if (!this.isGettingPrivateKeys) {
      this.pin = '';
      this.getPrivateKeysClosed.emit(false);
    }
  }
  resetStatusMessages(){
    this.showError = false;
    this.showErrorPin = false;
  }

}
