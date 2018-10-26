import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {MiraBox} from '../../../mirabox/mirabox';
import {LastActionsService} from './last-actions.service';
import {EventAction} from './action';
import {Subject, from} from 'rxjs';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-last-actions',
  templateUrl: './last-actions.component.html',
  styleUrls: ['./last-actions.component.css']
})
export class LastActionsComponent implements OnInit, OnDestroy {
  lastActions = new Subject();
  actions;
  $lastActions = this.lastActions.asObservable();
  @Input() miraBox: MiraBox;
  @Input() parentSubject: Subject<any>;

  constructor(private lastActionsSvc: LastActionsService) {
  }

  ngOnInit() {
    this.$lastActions
      .pipe(flatMap(() => from(this.getLastActions())))
      .subscribe((actions) => { this.actions = actions; })
    this.lastActions.next();
    this.parentSubject.subscribe(event => {
      if (event === 'update_last_actions') {
        this.lastActions.next();
      }
    });
  }
  ngOnDestroy() {
    this.parentSubject.unsubscribe();
  }

  getLastActions(): Promise<EventAction[]> {
    return new Promise((resolve, reject) => {
      this.lastActionsSvc.getLastActions(this.miraBox)
        .then((ev: EventAction[]) => {
          console.log(ev);
          const lastActions: EventAction[] = ev;
          return resolve(lastActions.sort((a, b) => b.blockNumber - a.blockNumber));
        });
    });
  }


}
