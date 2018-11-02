import {Injectable} from '@angular/core';

declare const require: any;

@Injectable()
export class Web3Service {
  w3: any;
  constructor() {
    const W3 = require('web3');
    this.w3 = new W3(new W3.providers.WebsocketProvider('wss://node1.miralab.io'));
  }
}
