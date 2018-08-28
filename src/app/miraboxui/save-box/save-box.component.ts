import {Component, OnInit} from '@angular/core';
import {PopUpSaveBoxService} from './pop-up-save-box.service';


@Component({
  selector: 'app-save-box',
  templateUrl: './save-box.component.html',
  styleUrls: ['./save-box.component.css']
})
export class SaveBoxComponent implements OnInit {

  constructor
  (private popUpSvc: PopUpSaveBoxService) {
  }

  show$;

  ngOnInit() {
    this.show$ = this.popUpSvc.showPopUp$;
  }

  showPopUp() {
    this.popUpSvc.showPopUp();
  }

  closePopUp() {
    this.popUpSvc.closePopUp();
  }

}
