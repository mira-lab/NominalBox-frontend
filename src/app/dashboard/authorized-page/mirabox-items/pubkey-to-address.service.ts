import {Injectable} from '@angular/core';

import * as bitcore from 'bitcore-lib';
import {Web3Service} from '../../../mirabox/web3.service';

@Injectable()
export class PubkeyToAddressService {
  w3: any;

  constructor(private web3Svc: Web3Service) {
    this.w3 = web3Svc.w3;
  }

  pubToLTCAddress(publicKey: string): string {
    bitcore.Networks.add({
      name: 'litecoin',
      alias: 'LTC',
      pubkeyhash: 0x48,
      privatekey: 0xb0,
      scripthash: 0x05,
      xpubkey: 0x0488b21e,
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
    return new bitcore.Address(new bitcore.PublicKey(publicKey), bitcore.Networks.get('litecoin', undefined)).toString();
  }

  pubTotLTCAddress(publicKey: string): string {
    bitcore.Networks.add({
      name: 'litecointestnet',
      alias: 'tLTC',
      pubkeyhash: 0x6f,
      privatekey: 0xef,
      scripthash: 0xc4,
      xpubkey: 0x043587cf,
      xprivkey: 0x04358394,
      port: 19333,
      dnsSeeds: [
        'testnet-seed.litecointools.com',
        'testnet-seed.ltc.xurious.com'
      ],
    });
    return (new bitcore.Address(new bitcore.PublicKey(publicKey), bitcore.Networks.get('litecointestnet', undefined))).toString();
  }

  pubToBCHAddress(publicKey: string): string {
    bitcore.Networks.add({
      name: 'bitcoincash',
      alias: 'BCH',
      prefix: 'bitcoincash',
      pubkeyhash: 28,
      privatekey: 0x80,
      scripthash: 40,
      xpubkey: 0x0488b21e,
      xprivkey: 0x0488ade4,
      port: 8333

    });
    return (new bitcore.Address(new bitcore.PublicKey(publicKey), bitcore.Networks.get('bitcoincash', undefined))).toString();
  }

  pubTotBCHAddress(publicKey: string): string {
    bitcore.Networks.add({
      name: 'bitcoincashtestnet',
      alias: 'tBCH',
      pubkeyhash: 0x6f,
      privatekey: 0xef,
      scripthash: 0xc4,
      xpubkey: 0x043587cf,
      xprivkey: 0x04358394,

    });
    return (new bitcore.Address(new bitcore.PublicKey(publicKey), bitcore.Networks.get('bitcoincashtestnet', undefined))).toString();
  }

  pubToBTCAddress(publicKey: string): string {
    return (new bitcore.Address(new bitcore.PublicKey(publicKey), bitcore.Networks.get('mainnet', undefined))).toString();
  }

  pubToETHAddress(publicKey: string): string {
    return '0x' + this.w3.utils.keccak256('0x' + publicKey.slice(2)).slice(26);
  }

  publicKeyToAddress(currency: string, pubKey: string): string {
    let address = '';
    switch (currency) {
      case 'BTC':
        address = this.pubToBTCAddress(pubKey);
        break;
      case 'BCH':
        address = this.pubToBCHAddress(pubKey);
        break;
      case 'LTC':
        address = this.pubToLTCAddress(pubKey);
        break;
      case 'USDT':
        address = this.pubToBTCAddress(pubKey);
        break;
      case 'ETH':
        address = this.pubToETHAddress(pubKey);
        break;
      default:
        address = 'publicKey: ' + pubKey;
        break;
    }
    return address;
  }
}
