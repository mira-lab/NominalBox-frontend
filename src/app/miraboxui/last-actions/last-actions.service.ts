import {Injectable} from '@angular/core';
import {MiraBox} from '../mirabox';
import {Web3Service} from '../web3.service';
import {miraConfig} from '../mira-config';
import {EventAction} from './action';
import {EventsToActions} from './events';

declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class LastActionsService {
  w3;

  constructor(private web3Svc: Web3Service) {
    this.w3 = this.web3Svc.getWeb3();
  }

  function;

  timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000);
    const year = a.getFullYear();
    const month = a.getMonth() + 1 < 10 ? '0' + (a.getMonth() + 1) : a.getMonth() + 1;
    const date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
    const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
    const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    const sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    const time = date + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  async getLastActions(miraBox: MiraBox) {
    const miraBoxContractEvents: any = await this.getAllEvents(miraBox);
    const miraBoxPurchased = await this.getActionCoinsSpent(miraBox);
    const miraBoxTransfer = await this.getMiraAccountTransfers(miraBox);
    const miraBoxLicenseBurn = await this.getMiraAccountLicenseBurns(miraBox);

    const allEvents = miraBoxContractEvents
      .concat(miraBoxPurchased, miraBoxTransfer, miraBoxLicenseBurn)
      .filter(event => !!EventsToActions[event.event])
      .map(event => {
        return <EventAction>{
          eventName: event.event,
          blockNumber: event.blockNumber,
          actionName: EventsToActions[event.event],
          time: ''
        };
      });
    const getBlocksPromises = allEvents.map(async (event) => await this.w3.eth.getBlock(event.blockNumber));
    try {
      const blocks: any = await Promise.all(getBlocksPromises);
      allEvents.forEach((event, index) => {
        event.time = this.timeConverter(blocks[index].timestamp);
      });
    } catch (err) {
      console.log(err);
    }
    return allEvents;
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

  getMiraAccountLicenseBurns(miraBox: MiraBox) {
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

  getAllEvents(miraBox: MiraBox) {
    const miraBoxAddress = this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
    return new Promise((resolve, reject) => {
      const miraContractAbi = require('../contractAbis/MiraboxContract.json');
      const miraContract = new this.w3.eth.Contract(miraContractAbi, miraBox.getMiraBoxItems()[0].contract);
      miraContract.getPastEvents('allEvents', {fromBlock: 0})
        .then(events => resolve(events))
        .catch(err => reject(err));
    });
  }

}
