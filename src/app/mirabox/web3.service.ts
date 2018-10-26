import {Injectable} from '@angular/core';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  constructor() {
  }

  public getWeb3() {
    const W3 = require('web3');
    return new W3(new W3.providers.WebsocketProvider('wss://node1.miralab.io'));
  }
}
