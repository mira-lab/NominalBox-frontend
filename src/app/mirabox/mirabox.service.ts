import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

import * as Bitcore from 'bitcore-lib';
import {MiraBox, MiraBoxItem} from './mirabox';
import {miraConfig} from './mira-config';
import {Web3Service} from './web3.service';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class MiraboxService {
  w3: any;
  constructor(private web3Svc: Web3Service,
              private http: Http) {
    this.w3 = web3Svc.getWeb3();
  }

  createMiraAccount(): any {
    return this.w3.eth.accounts.create();
  }

  createMiraBoxItems(currencies, miraAccount): Promise<MiraBoxItem[]> {
    return new Promise((resolve, reject) => {
      const licenseContractAbi = require('./contract-abis/License.json');
      const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
      const txData = licenseContract.methods.buyMirabox(this.w3.utils.fromAscii('TwoFactor')).encodeABI();
      console.log(this.w3.utils.fromAscii('TwoFactor'));
      this.w3.eth.accounts.signTransaction({
        to: miraConfig.licenseContractAddress,
        value: this.w3.utils.toWei('0'),
        gas: 10000000,
        gasPrice: '100',
        data: txData
      }, miraAccount.privateKey)
        .then((tx: any) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
        .then((receipt: any) => {
          console.log(receipt);
          return licenseContract.getPastEvents('PurchasedContract', {
            filter: {owner: miraAccount.address},
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber
          });
        })
        .then((pastEvents: any) => {
          console.log(pastEvents);
          const miraboxContractAbi = require('./contract-abis/MiraboxContract.json');
          const miraboxContract = new this.w3.eth.Contract(miraboxContractAbi, pastEvents[0].returnValues.contractAddress);
          console.log(pastEvents[0].returnValues.contractAddress);

          miraboxContract.methods.getPublicKey()
            .call()
            .then((publicKey: string) => {
              const miraBoxItems: MiraBoxItem[] = currencies.map((currency) => {
                const miraBoxItem: MiraBoxItem = {
                  currency: currency.symbol,
                  address: publicKey,
                  contract: pastEvents[0].returnValues.contractAddress
                };
                return miraBoxItem;
              });
              console.log(miraBoxItems);
              return resolve(miraBoxItems);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  createMiraBox(currencies: any, miraBoxTitle: string): Promise<MiraBox> {
    return new Promise((resolve, reject) => {
      const miraAccount = this.createMiraAccount();
      console.log(currencies);
      console.log(miraAccount.privateKey);
      Promise.all([this.faucetMiraCoins(miraAccount.address), this.faucetLicense(miraAccount.address)])
        .then(() => {
          console.log(miraAccount.address)
          return this.createMiraBoxItems(currencies, miraAccount);
        })
        .then((miraBoxItems: MiraBoxItem[]) => {
            return resolve(new MiraBox(null, miraBoxTitle, miraAccount.privateKey, miraBoxItems));
        })
        .catch(err => reject(err));
    });
  }

  getActionCoinBalance(privateKey): Promise<string> {
    return new Promise((resolve, reject) => {
      this.w3.eth.getBalance(this.w3.eth.accounts.privateKeyToAccount(privateKey).address)
        .then((wei: string) => {
          return resolve(this.w3.utils.fromWei(wei, 'ether'));
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  getLicenseBalance(privateKey): Promise<number> {
    return new Promise((resolve, reject) => {
      const licenseContractAbi = require('./contract-abis/License.json');
      const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
      licenseContract.methods.balanceOf(this.w3.eth.accounts.privateKeyToAccount(privateKey).address)
        .call()
        .then((result) => {
          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  add2fa(miraBox: MiraBox, address2fa: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const miraContractAbi = require('./contract-abis/MiraboxContract.json');
      const miraContract = new this.w3.eth.Contract(miraContractAbi, miraBox.getMiraBoxItems()[0].contract);
      const txData = miraContract.methods.add2Fa(address2fa).encodeABI();
      this.w3.eth.accounts.signTransaction({
        to: miraBox.getMiraBoxItems()[0].contract,
        value: this.w3.utils.toWei('0'),
        gas: 1000000,
        gasPrice: '10000',
        data: txData
      }, miraBox.getPrivateKey())
        .then((tx) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }


  faucetLicense(miraAccountAddress): Promise<any> {
    return this.http.post(miraConfig.licenseFaucetURL, {address: miraAccountAddress}).toPromise();
  }

  faucetMiraCoins(miraAccountAddress): Promise<any> {
    return this.http.post(miraConfig.miraCoinFaucetURL, {address: miraAccountAddress}).toPromise();
  }

  getMiraBoxAddress(miraBox: MiraBox): string {
    return this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
  }

  changeMiraBoxItemReceiver(miraBox: MiraBox, miraBoxItem: MiraBoxItem): Promise<any> {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('./contract-abis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBoxItem.contract);
      const newReceiver = this.generatePublicKey(miraBox.getPrivateKey());
      const txData = miraBoxContract.methods.changeReceiver(newReceiver).encodeABI();
      this.w3.eth.accounts.signTransaction({
        to: miraBoxItem.contract,
        value: this.w3.utils.toWei('0'),
        gas: 1000000,
        gasPrice: '10000',
        data: txData
      }, miraBox.getPrivateKey())
        .then((tx) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
        .then(receipt => resolve(receipt))
        .catch(err => reject(err));
    });
  }

  openMiraBoxItem(miraBox: MiraBox, miraBoxItem: MiraBoxItem): Promise<any> {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('./contract-abis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBoxItem.contract);
      const txData = miraBoxContract.methods.open().encodeABI();
      this.w3.eth.accounts.signTransaction({
        to: miraBoxItem.contract,
        value: this.w3.utils.toWei('0'),
        gas: 1000000,
        gasPrice: '10000',
        data: txData
      }, miraBox.getPrivateKey())
        .then((tx) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
        .then(receipt => resolve(receipt))
        .catch(err => reject(err));
    });
  }

  generatePublicKey(privateKey): string {
    const bitcore = require('bitcore-lib');
    const public1 = new bitcore.PrivateKey(privateKey.slice(2)).toPublicKey().toObject();
    public1.compressed = false;
    return new Bitcore.PublicKey(public1).toString();
  }

  decodePrivateKey(miraBoxPK, encodedPK): string {
    const sjcl = require('../../assets/js/sjcl/sjcl.js');
    const secret_key = new sjcl.ecc.elGamal.secretKey(
      sjcl.ecc.curves.k256,
      sjcl.ecc.curves.k256.field.fromBits(sjcl.codec.hex.toBits(miraBoxPK.slice(2)))
    );
    return sjcl.decrypt(secret_key, encodedPK);
  }

  isMiraboxItemOpened(miraBox: MiraBox, miraBoxItem: MiraBoxItem): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('./contract-abis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBoxItem.contract);
      miraBoxContract.methods.askOpen()
        .call()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  getOpenedMiraBoxItemPK(miraBoxItem: MiraBoxItem, miraBoxPrivateKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('./contract-abis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBoxItem.contract);
      miraBoxContract.getPastEvents('PrivateKey', {fromBlock: 0})
        .then((privateKeyEvent: any) => {
          if (privateKeyEvent.length > 0 && privateKeyEvent[0].returnValues['_value']) {
            return resolve(this.decodePrivateKey(miraBoxPrivateKey, privateKeyEvent[0].returnValues['_value']));
          } else {
            return reject('Couldn\'t get private key from events!');
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });

  }

  openMiraBox(miraBox: MiraBox): Promise<string> {
    return new Promise((resolve, reject) => {
      this.openMiraBoxItem(miraBox, miraBox.getMiraBoxItems()[0])
        .then((receipt) => {
            const miraBoxContractAbi = require('./contract-abis/MiraboxContract.json');
            const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBox.getMiraBoxItems()[0].contract);
            console.log(receipt);
            miraBoxContract.once('PrivateKey', {}, (err, ev) => {
              console.log(ev);
              if (!err && ev.returnValues['_value']) {
                return resolve(this.decodePrivateKey(miraBox.getPrivateKey(), ev.returnValues['_value']));
              } else {
                return reject(err || 'Didn\'t get privateKey from contract!');
              }
            });
          }
        )
        .catch((err) => {
          reject(err);
        });
    });
  }


}
