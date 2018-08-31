import { Injectable } from '@angular/core';
declare var require: any;
@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  constructor() { }

  public getWeb3() {
    const W3 = require('web3');
    return new W3(new W3.providers.WebsocketProvider('ws://94.130.94.163:8546'));
  }
}
