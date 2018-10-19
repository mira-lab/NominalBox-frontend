import {Injectable} from '@angular/core';
import {MiraBox} from '../mirabox';
import {Web3Service} from '../web3.service';
import {miraConfig} from '../mira-config';
import {LastAction} from './last-action';

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
    const usedEvents = [
      'Open', 'PrivateKey', 'Transfer', 'Burn', 'ContractCreated'
    ];
    const lastActions = miraBoxContractEvents
      .concat(miraBoxPurchased, miraBoxTransfer, miraBoxLicenseBurn)
      .filter(event => usedEvents.includes(event.event))
      .map(event => {
        console.log('EVENT:', event);
        switch (event.event) {
          case 'Open':
            return <LastAction>{
              blockNumber: event.blockNumber,
              eventString: 'MiraBox Opened',
              time: ''
            };
          case 'PrivateKey':
            return <LastAction>{
              blockNumber: event.blockNumber,
              eventString: 'Got private keys from master node',
              time: ''
            };
          case 'ContractCreated':
            return <LastAction>{
              blockNumber: event.blockNumber,
              eventString: 'Bought MiraBox for 1 license',
              time: ''
            };
          case 'Transfer':
            return <LastAction>{
              blockNumber: event.blockNumber,
              eventString: `Got ${event.returnValues.value} license`,
              time: ''
            };
          case 'Burn':
            return <LastAction>{
              blockNumber: event.blockNumber,
              eventString: `Spent ${event.returnValues.value} license`,
              time: ''
            };
        }
      });
    const getBlocksPromises = lastActions.map(async (lastAction) => await this.w3.eth.getBlock(lastAction.blockNumber));
    try {
      const blocks: any = await Promise.all(getBlocksPromises);
      lastActions.forEach((lastAction, index) => {
        lastAction.time = this.timeConverter(blocks[index].timestamp);
      });
    } catch (err) {
      console.log(err);
    }
    return lastActions;
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
        .then(events => {
          console.log('Transfer', events);
          return resolve(events);
        })
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
        .then(events => {
          console.log('Burn', events);
          return resolve(events);
        })
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
        .then(events => {
          console.log('PurchasedContract', events);
          return resolve(events);
        })
        .catch(err => reject(err));
    });
  }

  getAllEvents(miraBox: MiraBox) {
    const miraBoxAddress = this.w3.eth.accounts.privateKeyToAccount(miraBox.getPrivateKey()).address;
    return new Promise((resolve, reject) => {
      const miraContractAbi = require('../contractAbis/MiraboxContract.json');
      const miraContract = new this.w3.eth.Contract(miraContractAbi, miraBox.getMiraBoxItems()[0].contract);
      miraContract.getPastEvents('allEvents', {fromBlock: 0})
        .then(events => {
          console.log('allEvents', events);
          return resolve(events);
        })
        .catch(err => reject(err));
    });
  }

}
