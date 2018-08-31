import {Injectable} from '@angular/core';
import {MiraBox} from './mirabox';

@Injectable({
  providedIn: 'root'
})
export class MiraboxDataService {

  constructor() {
  }

  miraBox: MiraBox;

  setMiraBox(newMiraBox: MiraBox) {
    this.miraBox = newMiraBox;
  }

  getMiraBox() {
    if (this.miraBox) {
      return this.miraBox;
    }
  }
}
