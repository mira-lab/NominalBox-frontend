import {Injectable} from '@angular/core';
import {MiraBox} from '../mirabox';
import {MiraboxService} from '../mirabox.service';
import {MiraboxDataService} from '../mirabox-data.service';
import {ServerCommunicationService} from '../server-communication.service';

@Injectable({
  providedIn: 'root'
})
export class RepackMiraboxService {

  constructor(private miraBoxSvc: MiraboxService,
              private miraBoxDataSvc: MiraboxDataService,
              private serverCommSvc: ServerCommunicationService) {
  }

  repackAndChangeEmail(miraBox: MiraBox, newEmail: string, pin: string) {
    return new Promise((resolve, reject) => {
      this.miraBoxSvc.repackMiraBox(miraBox)
        .then((newMiraBox: MiraBox) => {
          this.miraBoxDataSvc.setMiraBox(newMiraBox);
          const miraBoxPublicKey = this.miraBoxSvc.generatePublicKey(miraBox.getPrivateKey());
          this.serverCommSvc.changeEmail(pin, pin, newMiraBox.getMiraBoxItems()[0].contract, newEmail, miraBoxPublicKey)
            .then((changeEmailResponse) => {
              console.log('Got changeEmailResponse', changeEmailResponse);
              resolve(newMiraBox);
            })
            .catch(err => reject(err));
        });
    });
  }

  repack(miraBox: MiraBox) {
    return new Promise((resolve, reject) => {
      this.miraBoxSvc.repackMiraBox(miraBox)
        .then((newMiraBox: MiraBox) => {
          this.miraBoxDataSvc.setMiraBox(newMiraBox);
          resolve(newMiraBox);
        })
        .catch(err => reject(err));
    });
  }

  repackAndSendByEmail(miraBox: MiraBox) {
    return new Promise((resolve, reject) => {
      const miraBoxPublicKey = this.miraBoxSvc.generatePublicKey(miraBox.getPrivateKey());
      this.repack(miraBox).then((newMiraBox: MiraBox) => {
        this.serverCommSvc.getEmail(miraBoxPublicKey, miraBox.getMiraBoxItems()[0].contract)
          .then((response: any) => {
            console.log('Got email from server.', response);
            return this.serverCommSvc.sendMiraBoxByEmail(newMiraBox, response._body.slice(1, response._body.length - 1));
          })
          .then((response: any) => {
            console.log('Got response from sendMiraBoxByEmail request', response);
            return resolve(newMiraBox);
          }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }

  repackChangeEmailAndSend(miraBox: MiraBox, newEmail: string, pin: string) {
    return new Promise((resolve, reject) => {
      this.repackAndChangeEmail(miraBox, newEmail, pin)
        .then((newMiraBox: MiraBox) => {
          return this.serverCommSvc.sendMiraBoxByEmail(newMiraBox, newEmail)
            .then(() => {
              resolve(newMiraBox);
            })
            .catch(err => reject(err));
        }).catch(err => reject(err));
    });
  }
}
