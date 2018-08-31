import { Injectable } from '@angular/core';
import * as bitcore from 'bitcore-lib'
@Injectable({
  providedIn: 'root'
})
export class PubkeyToAddressService {

  constructor() { }

  pubtoLTC(publicKey: string) {
    const pubKey = new bitcore.PublicKey('0363dd2a4c0f704034f454a6f6e8703e3d3a51a4f6b77d0375879d8b425700ff6e');
    bitcore.Networks.add({
      name: 'litecoin',
      alias: 'LTC',
      pubkeyhash: 0x48,
      privatekey: 0xb0,
      scripthash: 0x05,
      xpubkey:  0x0488b21e,
      xprivkey: 0x0488ade4,
      port: 9333,
      dnsSeeds: [
        'dnsseed.litecointools.com',
        'dnsseed.litecoinpool.org',
        'dnsseed.ltc.xurious.com',
        'dnsseed.koin-project.com',
        'dnsseed.weminemnc.com'
      ]
    });
  return  new bitcore.Address(pubKey, bitcore.Networks['litecoin']).toString();
  }
}
