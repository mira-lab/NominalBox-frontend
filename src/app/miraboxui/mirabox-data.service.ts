import {Injectable} from '@angular/core';
import {MiraBox} from './mirabox';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiraboxDataService {

  constructor() {
  }
  private changeInDataSource = new Subject();
  changeInData$ = this.changeInDataSource.asObservable();

  miraBox: MiraBox;

  setMiraBox(newMiraBox: MiraBox) {
    this.miraBox = newMiraBox;
    this.changeInDataSource.next(this.miraBox);
  }

  getMiraBox() {
    if (this.miraBox) {
      return this.miraBox;
    }
  }
}
