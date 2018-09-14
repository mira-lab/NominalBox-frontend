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

  addPin(pin: string, miraBoxAddress: string) {
    return this.http.post(miraConfig.setPinURL, {new_pin: pin, mirabox_address: miraBoxAddress}).toPromise();
  }

  changePin(oldPin: string, newPin: string, miraBoxAddress: string) {
    return this.http.post(miraConfig.changePinURL, {old_pin: oldPin, new_pin: newPin, mirabox_address: miraBoxAddress}).toPromise();
  }

  sendMiraBoxByEmail(miraBox: MiraBox, _email: string) {
    return this.http.post(miraConfig.sendByEmailURL, {
      mirabox_title: miraBox.getTitle(),
      mirabox: miraBox.toString(),
      email: _email
    }).toPromise();
  }
}
