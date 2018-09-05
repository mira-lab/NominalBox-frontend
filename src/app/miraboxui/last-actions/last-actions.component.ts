import {Component, OnInit, Input} from '@angular/core';
import {MiraBox} from '../mirabox';
import {LastActionsService} from './last-actions.service';

@Component({
  selector: 'app-last-actions',
  templateUrl: './last-actions.component.html',
  styleUrls: ['./last-actions.component.css']
})
export class LastActionsComponent implements OnInit {
  @Input() miraBox: MiraBox;

  constructor(private lastActionsSvc: LastActionsService) {
  }

  ngOnInit() {
    this.lastActionsSvc.getMiraAccountTransfers(this.miraBox).then((ev) => {
      console.log(ev);
    });
    this.lastActionsSvc.getMiraAccountLicenseBurns(this.miraBox).then((ev) => {
      console.log(ev);
    });
    this.lastActionsSvc.getActionCoinsSpent(this.miraBox).then((ev) => {
      console.log(ev);
    });
  }


}
