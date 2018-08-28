import {Injectable} from '@angular/core';
import { Web3Service } from './web3.service';
import {MiraBox} from './mirabox';
declare var require: any;
@Injectable({
  providedIn: 'root'
})
export class MiraboxService {

  constructor(private web3Svc: Web3Service) {
    this.w3 = web3Svc.getWeb3();
  }

  miraAccount: any;
  w3: any;
  licenseContractAddress = '0xd498cd86892c72fd2eaa00e3f9adfe3f1f03d05b';
  tmpPK = '0xd8d928af140aade00d4d0d4e14ff24f7ef0bf681286b5f2188544a9f3011bf2f';
  miraBox: MiraBox;
  createMiraAccount() {
    this.miraAccount = this.w3.eth.accounts.create();
    console.log(this.miraAccount);
  }

  createMiraBoxItem() {
    if (!this.miraAccount) {
      this.createMiraAccount();
    }
    const licenseContractAbi = require('../miraboxui/contractAbis/License.json');
    const licenseContract = new this.w3.eth.Contract(licenseContractAbi, this.licenseContractAddress);
    const txData = licenseContract.methods.buyMirabox(this.w3.utils.fromAscii('Onrequest')).encodeABI();
    licenseContract.once('PurchasedContract', {filter: {owner: this.miraAccount.address}},
      (error, event) => {
        console.log(event);
      });
    this.w3.eth.accounts.signTransaction({
      to: this.licenseContractAddress,
      value: this.w3.utils.toWei('0'),
      gas: 7220000,
      gasPrice: '10000',
      data: txData
    }, this.tmpPK)//miraAccount.privateKey)
      .then((tx) => this.w3.eth.sendSignedTransaction(tx.rawTransaction))
      .catch(console.error);
  }

  createMiraBox() {
    if (!this.miraAccount){
      this.createMiraAccount();
    }
    this.miraBox = new MiraBox(null, null, this.miraAccount.privateKey);
  }
}
