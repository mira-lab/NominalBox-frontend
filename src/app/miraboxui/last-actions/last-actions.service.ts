import { Injectable } from '@angular/core';
import {MiraBox} from '../mirabox';
import {Web3Service} from '../web3.service';
import {miraConfig} from '../mira-config';
declare var require: any;
@Injectable({
  providedIn: 'root'
})
export class LastActionsService {
  w3;
  constructor(private web3Svc: Web3Service) {
   this.w3 = this.web3Svc.getWeb3();
  }
  getLastActions(){
    return new Promise((resolve, reject) => {

    });
  }

  getMiraAccountTransfers(miraBox: MiraBox) {
    const miraBoxAddress = this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
    return new Promise((resolve, reject) => {
      const licenseContractAbi = require('../contractAbis/License.json');
      const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
      licenseContract.getPastEvents('Transfer', {
        filter: {to: miraBoxAddress},
        fromBlock: 0
      })
        .then(events => resolve(events))
        .catch(err => reject(err));
    });
  }

  getMiraAccountLicenseBurns(miraBox: MiraBox){
    const miraBoxAddress = this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
    return new Promise((resolve, reject) => {
      const licenseContractAbi = require('../contractAbis/License.json');
      const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
      licenseContract.getPastEvents('Burn', {
        filter: {burner: miraBoxAddress},
        fromBlock: 0
      })
        .then(events => resolve(events))
        .catch(err => reject(err));
    });
  }
  getActionCoinsSpent(miraBox: MiraBox) {
    const miraBoxAddress = this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
    return new Promise((resolve, reject) => {
      const licenseContractAbi = require('../contractAbis/License.json');
      const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
      licenseContract.getPastEvents('PurchasedContract', {
        filter: {owner: miraBoxAddress},
        fromBlock: 0
      })
        .then(events => resolve(events))
        .catch(err => reject(err));
    });
  }

}
