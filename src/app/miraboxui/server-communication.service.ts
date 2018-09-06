import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {miraConfig} from './mira-config';

@Injectable({
  providedIn: 'root'
})

export class ServerCommunicationService {

  constructor(private http: Http) { }

  addPin(pin: string, miraBoxAddress: string) {
    return this.http.post(miraConfig.pinPostURL, {new_pin: pin, mirabox_address: miraBoxAddress}).toPromise();
  }
  changePin(oldPin: string, newPin: string, miraBoxAddress: string) {
    return this.http.post(miraConfig.pinPostURL, {old_pin: oldPin, new_pin: newPin, mirabox_address: miraBoxAddress}).toPromise();
  }
}
