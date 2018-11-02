import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {MiraBox} from '../mirabox/mirabox';


@Injectable()
export class MiraboxDataService {

  constructor() {
  }
  private changeInDataSource = new Subject();
  changeInData$ = this.changeInDataSource.asObservable();

  miraBox: MiraBox;

  setMiraBox(newMiraBox: MiraBox): void {
    this.miraBox = newMiraBox;
    this.changeInDataSource.next(this.miraBox);
  }

  getMiraBox(): MiraBox {
    if (this.miraBox) {
      return this.miraBox;
    }
  }
}
