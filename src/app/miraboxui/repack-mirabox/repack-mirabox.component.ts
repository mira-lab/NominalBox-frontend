import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MiraBox} from '../mirabox';
import {MiraboxService} from '../mirabox.service';
import {MiraboxDataService} from '../mirabox-data.service';
import {ServerCommunicationService} from '../server-communication.service';

@Component({
  selector: 'app-repack-mirabox',
  templateUrl: './repack-mirabox.component.html',
  styleUrls: ['./repack-mirabox.component.css']
})
export class RepackMiraboxComponent implements OnInit {
  @Input() miraBox: MiraBox;
  @Output() repackMiraBoxClosed = new EventEmitter<boolean>();
  errorMessage = '';
  miraboxCreating = false;
  pin = '';
  newEmail = '';
  checkBox = false;
  showError = false;
  constructor(private miraBoxSvc: MiraboxService,
              private miraBoxDataSvc: MiraboxDataService,
              private serverCommSvc: ServerCommunicationService) {
  }

  ngOnInit() {
  }

  repackSendByEmail() {
    if (this.checkBox && !this.newEmail) {
      this.showErrorMessage('Email field can\'t be empty!');
      return;
    }
    this.miraBoxSvc.repackMiraBox(this.miraBox)
      .then((newMiraBox: MiraBox) => {
        this.miraBoxDataSvc.setMiraBox(newMiraBox);
        const miraBoxPublicKey = this.miraBoxSvc.generatePublicKey(this.miraBox.getPrivateKey());
        if (this.checkBox) {
          this.serverCommSvc.changeEmail(this.pin, this.pin, newMiraBox.getMiraBoxItems()[0].contract, this.newEmail, miraBoxPublicKey)
            .then(() => this.serverCommSvc.sendMiraBoxByEmail(newMiraBox, this.newEmail))
            .then(() => this.repackMiraBoxClosed.emit(true))
            .catch(err => console.log(err));
        } else {
          this.serverCommSvc.getEmail(miraBoxPublicKey, this.miraBox.getMiraBoxItems()[0].contract)
            .then((response: any) => {
              console.log(response);
              return this.serverCommSvc.sendMiraBoxByEmail(newMiraBox, response);
            })
            .then(() => this.repackMiraBoxClosed.emit(true))
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        alert('Something went wrong with repacking mirabox!');
        console.log(err);
      });
  }

  repackDownload() {
    this.miraBoxSvc.repackMiraBox(this.miraBox)
      .then((newMiraBox: MiraBox) => {
        this.miraBoxDataSvc.setMiraBox(newMiraBox);
        this.downloadMiraBox(newMiraBox);
        return this.repackMiraBoxClosed.emit(true);
      })
      .catch(err => {
        alert('Something went wrong with repacking mirabox!');
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
  showErrorMessage(error: string){
    console.log(error);
  }
  closeWindow() {
    this.repackMiraBoxClosed.emit(false);
  }
}
