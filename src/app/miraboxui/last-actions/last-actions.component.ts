import {Component, OnInit, Input} from '@angular/core';
import {MiraBox} from '../mirabox';
import {LastActionsService} from './last-actions.service';
import {EventAction} from './action';

@Component({
  selector: 'app-last-actions',
  templateUrl: './last-actions.component.html',
  styleUrls: ['./last-actions.component.css']
})
export class LastActionsComponent implements OnInit {
  @Input() miraBox: MiraBox;
  lastActionsPromise: Promise<EventAction[]>;
  constructor(private lastActionsSvc: LastActionsService) {
  }

  ngOnInit() {
    this.lastActionsPromise = this.getLastActions();
  }
  getLastActions(): Promise<EventAction[]> {
    return new Promise((resolve, reject) => {
      this.lastActionsSvc.getLastActions(this.miraBox)
        .then((ev: EventAction[]) => {
          console.log(ev);
          const lastActions: EventAction[] = ev;
          return resolve(lastActions.sort((a, b) => b.blockNubmer - a.blockNubmer));
        });
    });
  }


}
