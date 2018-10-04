import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {miraConfig} from './mira-config';
import {MiraBox} from './mirabox';

@Injectable({
  providedIn: 'root'
})

export class ServerCommunicationService {

  constructor(private http: Http) {
  }


  changePin(oldPin: string, newPin: string, contractAddress: string, signature: string) {
    return this.http.post(miraConfig.changePinURL, {
      pin: oldPin,
      newpin: newPin,
      contract: contractAddress,
      signature: signature
    }).toPromise();
  }

  changeEmail(oldPin: string, newPin: string, contractAddress: string, email: string, signature: string) {
    return this.http.post(miraConfig.changePinURL, {
      pin: oldPin,
      newpin: newPin,
      contract: contractAddress,
      email: email,
      signature: signature
    }).toPromise();
  }

  sendMiraBoxByEmail(miraBox: MiraBox, _email: string) {
    return this.http.post(miraConfig.sendByEmailURL, {
      mirabox_title: miraBox.getTitle(),
      mirabox: miraBox.toString(),
      email: _email
    }).toPromise();
  }

  openMiraBox(miraBox: MiraBox, _pin: string, publicKey: string) {
    return this.http.post(miraConfig.openBoxURL, {
      pin: _pin,
      contract: miraBox.getMiraBoxItems()[0].contract,
      signature: publicKey
    }).toPromise();
  }

  setPin(_pin: string, _email: string, _contract: string, _signature: string) {
    return this.http.post(miraConfig.setPinURL, {
      pin: _pin,
      email: _email,
      contract: _contract,
      signature: _signature
    }).toPromise();
  }
  checkPin(pin: string, contract: string, signature: string){
    return this.http.post(miraConfig.checkPinURL, {
      pin: pin,
      contract: contract,
      signature: signature
    }).toPromise();
  }

  getEmail(_signature: string, _contract: string) {
    return this.http.post(miraConfig.setPinURL, {
      signature: _signature,
      contract: _contract
    }).toPromise();
  }
}
