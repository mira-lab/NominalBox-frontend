import {Component, OnInit} from '@angular/core';
import {PopUpSaveBoxService} from '../save-box/pop-up-save-box.service';
import {MiraboxService} from '../mirabox.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  constructor(private popUpSvc: PopUpSaveBoxService,
              private miraboxSvc: MiraboxService) {
  }

  ngOnInit() {
  }

  showSaveBox() {
    this.popUpSvc.showPopUp();
  }

  test() {
    this.miraboxSvc.createMiraBoxItem();
  }

}
