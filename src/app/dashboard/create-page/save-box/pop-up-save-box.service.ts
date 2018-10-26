import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopUpSaveBoxService {

  private showPopUpSource = new Subject();
  showPopUp$ = this.showPopUpSource.asObservable();

  showPopUp() {
    this.showPopUpSource.next(true);
  }

  closePopUp() {
    this.showPopUpSource.next(false);
  }
}
