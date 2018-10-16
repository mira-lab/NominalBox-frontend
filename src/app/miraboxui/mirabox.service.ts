import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {MiraBox, MiraBoxItem} from './mirabox';
import {miraConfig} from './mira-config';
import {Http} from '@angular/http';
import * as Bitcore from 'bitcore-lib';

declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class MiraboxService {

  constructor(private web3Svc: Web3Service,
              private http: Http) {
    this.w3 = web3Svc.getWeb3();
  }

  w3: any;

  createMiraAccount() {
    return this.w3.eth.accounts.create();
  }

  createMiraBoxItems(currencies, miraAccount) {
    return new Promise((resolve, reject) => {
      const licenseContractAbi = require('../miraboxui/contractAbis/License.json');
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
        .then((tx) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
        .then((receipt) => {
          console.log(receipt);
          return licenseContract.getPastEvents('PurchasedContract', {
            filter: {owner: miraAccount.address},
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber
          });
        })
        .then((pastEvents) => {
          console.log(pastEvents);
          const miraboxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
          const miraboxContract = new this.w3.eth.Contract(miraboxContractAbi, pastEvents[0].returnValues.contractAddress);
          console.log(pastEvents[0].returnValues.contractAddress);

          miraboxContract.methods.getPublicKey()
            .call()
            .then((publicKey) => {
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

  createMiraBox(currencies, miraBoxTitle) {
    return new Promise((resolve, reject) => {
      const miraAccount = this.createMiraAccount();
      console.log(currencies);
      console.log(miraAccount.privateKey);
      Promise.all([this.faucetMiraCoins(miraAccount.address), this.faucetLicense(miraAccount.address)])
        .then(() => {
          console.log(miraAccount.address);
          return this.createMiraBoxItems(currencies, miraAccount);
        })
        .then((miraBoxItems: MiraBoxItem[]) => {
          return resolve(new MiraBox(null, miraBoxTitle, miraAccount.privateKey, miraBoxItems));
        })
        .catch(err => reject(err));
    });
  }

  getActionCoinBalance(privateKey) {
    return new Promise((resolve, reject) => {
      this.w3.eth.getBalance(this.w3.eth.accounts.privateKeyToAccount(privateKey).address)
        .then((wei) => {
          return resolve(this.w3.utils.fromWei(wei, 'ether'));
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  getLicenseBalance(privateKey) {
    return new Promise((resolve, reject) => {
      const licenseContractAbi = require('../miraboxui/contractAbis/License.json');
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

  add2fa(miraBox: MiraBox, address2fa: string) {
    return new Promise((resolve, reject) => {
      const miraContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
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


  faucetLicense(miraAccountAddress) {
    return new Promise((resolve, reject) => {
      this.http.post(miraConfig.licenseFaucetURL,
        {address: miraAccountAddress})
        .subscribe(
          res => {
            console.log(res);
            return resolve(res);
          },
          err => {
            return reject(err);
          }
        );
    });
  }

  faucetMiraCoins(miraAccountAddress) {
    return new Promise((resolve, reject) => {
      return this.http.post(miraConfig.miraCoinFaucetURL,
        {address: miraAccountAddress})
        .subscribe(
          res => {
            console.log(res);
            return resolve(res);
          },
          err => {
            return reject(err);
          }
        );
    });
  }

  getMiraBoxAddress(miraBox: MiraBox) {
    return this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
  }

  changeMiraBoxItemReceiver(miraBox: MiraBox, miraBoxItem: MiraBoxItem, newReceiver) {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBoxItem.contract);
      // const newReceiver = this.generatePublicKey(miraBox.getPrivateKey());
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

  openMiraBoxItem(miraBox: MiraBox, miraBoxItem: MiraBoxItem) {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
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

  generatePublicKey(privateKey) {
    const bitcore = require('bitcore-lib');
    const public1 = new bitcore.PrivateKey(privateKey.slice(2)).toPublicKey().toObject();
    public1.compressed = false;
    return new Bitcore.PublicKey(public1).toString();
  }

  decodePrivateKey(miraBoxPK, encodedPK) {
    const sjcl = require('../../assets/js/sjcl/sjcl.js');
    const secret_key = new sjcl.ecc.elGamal.secretKey(
      sjcl.ecc.curves.k256,
      sjcl.ecc.curves.k256.field.fromBits(sjcl.codec.hex.toBits(miraBoxPK.slice(2)))
    );
    return sjcl.decrypt(secret_key, encodedPK);
  }

  isMiraboxItemOpened(miraBox: MiraBox, miraBoxItem: MiraBoxItem) {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBoxItem.contract);
      miraBoxContract.methods.askOpen()
        .call()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  getOpenedMiraBoxItemPK(miraBoxItem: MiraBoxItem) {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBoxItem.contract);
      miraBoxContract.getPastEvents('PrivateKey', {fromBlock: 0})
        .then((res) => {
          return resolve(res);
        })
        .catch((err) => {
          return reject(err);
        });
    });

  }

  openMiraBox(miraBox: MiraBox) {
    return new Promise((resolve, reject) => {
      this.openMiraBoxItem(miraBox, miraBox.getMiraBoxItems()[0])
        .then((receipt) => {
            const miraBoxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
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

  repackMiraBox(miraBox: MiraBox) {
    return new Promise((resolve, reject) => {
      const contract = miraBox.getMiraBoxItems()[0].contract;
      const miraAccount = this.createMiraAccount();
      this.changeMiraBoxItemReceiver(miraBox, miraBox.getMiraBoxItems()[0], this.generatePublicKey(miraAccount.privateKey))
        .then((changeReceiverReceipt) => {
          console.log('Got changeReceiverReceipt receipt', changeReceiverReceipt);
          return this.changeContractOwner(miraBox.getPrivateKey(), contract, miraAccount.address);
        })
        .then((changeContractOwnerReceipt) => {
          console.log('Got changeContractOwner receipt', changeContractOwnerReceipt);
          return this.sendAllLicenseBalance(miraBox.getPrivateKey(), miraAccount.address);
        })
        .then((sendAllLicenseBalanceReceipt) => {
          console.log('Got sendAllLicenseBalance receipt', sendAllLicenseBalanceReceipt);
          return this.sendAllBalance(miraBox.getPrivateKey(), miraAccount.address);
        })
        .then((sendAllBalanceReceipt) => {
          console.log('Got sendAllBalance receipt', sendAllBalanceReceipt);
          miraBox.changeOwner(miraAccount.privateKey);
          console.log('Owner succesfully changed to ' + miraAccount.address);
          return resolve(miraBox);
        })
        .catch(err => reject(err));
    });
  }

  sendAllLicenseBalance(fromPK: string, toAddress: string) {
    return new Promise((resolve, reject) => {
      this.getLicenseBalance(fromPK).then((balance) => {
        console.log(balance);
        const licenseContractAbi = require('../miraboxui/contractAbis/License.json');
        const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
        const txData = licenseContract.methods.transfer(toAddress, balance).encodeABI();
        this.w3.eth.accounts.signTransaction({
          to: miraConfig.licenseContractAddress,
          value: this.w3.utils.toWei('0'),
          gas: 10000000,
          gasPrice: '100',
          data: txData
        }, fromPK)
          .then((tx) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
          .then(receipt => resolve(receipt))
          .catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }

  sendAllBalance(fromPK: string, toAddress: string) {
    return new Promise((resolve, reject) => {
      this.w3.eth.getGasPrice().then((gasPrice) => {
        this.w3.eth.getBalance(this.w3.eth.accounts.privateKeyToAccount(fromPK).address)
          .then((balance) => {
            const gas = this.w3.utils.toBN('21000');
            const cost = gas.mul(this.w3.utils.toBN(gasPrice));
            const sendAmount = this.w3.utils.toBN(balance).sub(cost);
            this.w3.eth.accounts.signTransaction({
              to: toAddress,
              value: sendAmount,
              gas: gas,
              gasPrice: gasPrice
            }, fromPK)
              .then((tx) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
              .then(receipt => resolve(receipt))
              .catch(err => reject(err));
          });
      });
    });
  }

  changeContractOwner(ownerPK, contract, newOwnerAddress) {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, contract);
      const txData = miraBoxContract.methods.changeOwner(newOwnerAddress).encodeABI();
      this.w3.eth.accounts.signTransaction({
        to: contract,
        value: this.w3.utils.toWei('0'),
        gas: 10000000,
        gasPrice: '100',
        data: txData
      }, ownerPK)
        .then((tx) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
        .then(receipt => resolve(receipt))
        .catch(err => reject(err));
    });
  }

}

