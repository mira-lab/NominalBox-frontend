import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {MiraBox, MiraBoxItem} from './mirabox';
import {Http} from '@angular/http';

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
  licenseContractAddress = '0x7de96ecd66921d3ba255c6a65f10a87f4146242a';

  createMiraAccount() {
    return this.w3.eth.accounts.create();
  }

  createMiraBoxItems(currencies, miraAccount) {
    return new Promise(((resolve, reject) => {
      const licenseContractAbi = require('../miraboxui/contractAbis/License.json');
      const licenseContract = new this.w3.eth.Contract(licenseContractAbi, this.licenseContractAddress);
      const txData = licenseContract.methods.buyMirabox(this.w3.utils.fromAscii('Onrequest')).encodeABI();
      this.w3.eth.accounts.signTransaction({
        to: this.licenseContractAddress,
        value: this.w3.utils.toWei('0'),
        gas: 1000000,
        gasPrice: '10000',
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
    }));
  }

  createMiraBox(currencies, miraBoxTitle) {
    return new Promise((resolve, reject) => {
      const miraAccount = this.createMiraAccount();
      console.log(currencies);
      console.log(miraAccount.privateKey);
      Promise.all([this.faucetMiraCoins(miraAccount.address), this.faucetLicense(miraAccount.address)])
        .then(() => {
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
      const licenseContract = new this.w3.eth.Contract(licenseContractAbi, this.licenseContractAddress);
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

  faucetLicense(miraAccountAddress) {
    return new Promise((resolve, reject) => {
      this.http.post('https://miralab.localtunnel.me/faucet/contract',
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
      return this.http.post('https://miralab.localtunnel.me/faucet/get',
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

  changeMiraBoxItemReceiver(miraBox: MiraBox, miraBoxItem: MiraBoxItem, newReceiver: string) {
    return new Promise((resolve, reject) => {
      const miraBoxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
      const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBoxItem.contract);
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

  openMiraBox(miraBox: MiraBox) {
    return new Promise((resolve, reject) => {
      this.changeMiraBoxItemReceiver(miraBox, miraBox.getMiraBoxItems()[0], miraBox.getMiraBoxItems()[0].address)
        .then(res =>  this.openMiraBoxItem(miraBox, miraBox.getMiraBoxItems()[0]) )
        .then((receipt) => {
            const miraBoxContractAbi = require('../miraboxui/contractAbis/MiraboxContract.json');
            const miraBoxContract = new this.w3.eth.Contract(miraBoxContractAbi, miraBox.getMiraBoxItems()[0].contract);
            console.log(receipt);
            miraBoxContract.events.PrivateKey((err, ev) => {
              if (!err) {
                return resolve(ev);
              } else {
                return reject(err);
              }
            }).on('error', (err) => reject(err));
          }
        )
        .catch((err) => {
          reject(err);
        });
    });
  }

}
