import {Injectable} from '@angular/core';

import {EventAction} from './action';
import {EventsToActions} from './events';
import {MiraBox} from '../../../mirabox/mirabox';
import {miraConfig} from '../../../mirabox/mira-config';
import {Web3Service} from '../../../mirabox/web3.service';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class LastActionsService {
  w3;

  constructor(private web3Svc: Web3Service) {
    this.w3 = this.web3Svc.getWeb3();
  }

  timeConverter(UNIX_timestamp): string {
    const a = new Date(UNIX_timestamp * 1000);
    const year = a.getFullYear();
    const month = a.getMonth() + 1 < 10 ? '0' + (a.getMonth() + 1) : a.getMonth() + 1;
    const date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
    const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
    const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    const sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    return date + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec;
  }

  getLastActions(miraBox: MiraBox): Promise<EventAction[]> {
    const getEventsPromises = [
      this.getAllEvents(miraBox),
      this.getActionCoinsSpent(miraBox),
      this.getMiraAccountTransfers(miraBox),
      this.getMiraAccountLicenseBurns(miraBox)
    ];
    return Promise.all(getEventsPromises)
      .then((events: any) => {
        const mergedEvents = [].concat.apply([], events);
        const allEvents = mergedEvents.filter(event => !!EventsToActions[event.event])
          .map(event => {
            return <EventAction>{
              eventName: event.event,
              blockNumber: event.blockNumber,
              actionName: EventsToActions[event.event],
              time: ''
            };
          });
        const getBlocksPromises = allEvents.map((event) => this.w3.eth.getBlock(event.blockNumber));
        return Promise.all(getBlocksPromises)
          .then((blocks: any) => {
            allEvents.forEach((event, index) => {
              event.time = this.timeConverter(blocks[index].timestamp);
            });
            return allEvents;
          });
      });
  }

  getMiraAccountTransfers(miraBox: MiraBox): Promise<any> {
    const miraBoxAddress = this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
    const licenseContractAbi = require('../../../mirabox/contract-abis/License.json');
    const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
    return licenseContract.getPastEvents('Transfer', {
      filter: {to: miraBoxAddress},
      fromBlock: 0
    });
  }

  getMiraAccountLicenseBurns(miraBox: MiraBox): Promise<any> {
    const miraBoxAddress = this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
    const licenseContractAbi = require('../../../mirabox/contract-abis/License.json');
    const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
    return licenseContract.getPastEvents('Burn', {
      filter: {burner: miraBoxAddress},
      fromBlock: 0
    });
  }

  getActionCoinsSpent(miraBox: MiraBox): Promise<any> {
    const miraBoxAddress = this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
    const licenseContractAbi = require('../../../mirabox/contract-abis/License.json');
    const licenseContract = new this.w3.eth.Contract(licenseContractAbi, miraConfig.licenseContractAddress);
    return licenseContract.getPastEvents('PurchasedContract', {
      filter: {owner: miraBoxAddress},
      fromBlock: 0
    });
  }

  getAllEvents(miraBox: MiraBox): Promise<any> {
    const miraContractAbi = require('../../../mirabox/contract-abis/MiraboxContract.json');
    const miraContract = new this.w3.eth.Contract(miraContractAbi, miraBox.getMiraBoxItems()[0].contract);
    return miraContract.getPastEvents('allEvents', {fromBlock: 0});
  }

}
