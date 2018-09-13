import {Component, OnDestroy, OnInit } from '@angular/core';
import {MiraboxService} from '../miraboxui/mirabox.service';
import {Router} from '@angular/router';
import {interval, from, Subject} from 'rxjs';
import {flatMap, startWith} from 'rxjs/operators';
import {MiraboxDataService} from '../miraboxui/mirabox-data.service';
import {MiraBox} from '../miraboxui/mirabox';
import {ServerCommunicationService} from '../miraboxui/server-communication.service';

@Component({
  selector: 'app-dashboard-authorized',
  templateUrl: './dashboard-authorized.component.html',
  styleUrls: ['./dashboard-authorized.component.css']
})
export class DashboardAuthorizedComponent implements OnInit, OnDestroy {
  miraBalance: any = '0';
  miraLicenseBalance: any = '0';
  miraBox: MiraBox;
  privateKey;
  gettingPrivateKeys = false;
  isGetPrivateKeysDisabled = true;
  changingPin = false;
  newPin;
  oldPin;
  parentSubject: Subject<any> = new Subject();
  constructor(private miraBoxSvc: MiraboxService,
              private router: Router,
              private miraBoxDataSvc: MiraboxDataService,
              private serverCommSvc: ServerCommunicationService) {
  }

  ngOnInit() {
    if (!this.miraBoxDataSvc.getMiraBox()) {
      return this.router.navigate(['create']);
    }
    this.miraBox = this.miraBoxDataSvc.getMiraBox();
    this.miraBoxSvc.isMiraboxItemOpened(this.miraBox, this.miraBox.getMiraBoxItems()[0])
      .then((res) => {
        if (res) {
          return this.miraBoxSvc.getOpenedMiraBoxItemPK(this.miraBox.getMiraBoxItems()[0]);
        } else {
          this.isGetPrivateKeysDisabled = false;
          return Promise.reject('Mirabox not opened');
        }
      })
      .then((event: any) => {
        if (event.length > 0 && event[0].returnValues['_value']) {
          this.privateKey = this.miraBoxSvc.decodePrivateKey(this.miraBox.getPrivateKey(), event[0].returnValues['_value']);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(this.miraBox);

    const intervalSource = interval(5000);
    intervalSource
      .pipe(startWith(0), flatMap(() => from(this.miraBoxSvc.getLicenseBalance(this.miraBox.getPrivateKey()))))
      .subscribe((miraLicenseBalance) => {
        this.miraLicenseBalance = miraLicenseBalance;
      });
    intervalSource
      .pipe(startWith(0), flatMap(() => from(this.miraBoxSvc.getActionCoinBalance(this.miraBox.getPrivateKey()))))
      .subscribe((miraCoinBalance) => {
        this.miraBalance = Math.floor(Number(miraCoinBalance) * 10000) + '';
      });
  }

  closeChangePin(isClosed: boolean){
    this.changingPin = isClosed;
  }

  getAllPrivateKeys() {
    this.gettingPrivateKeys = true;
    this.isGetPrivateKeysDisabled = true;
    this.miraBoxSvc.openMiraBox(this.miraBox)
      .then((pk) => {
        this.parentSubject.next('update_last_actions');
        this.privateKey = pk;
        this.gettingPrivateKeys = false;
      })
      .catch((err) => {
        console.log(err);
        this.gettingPrivateKeys = false;
      });
  }

  navigateToCreate() {
    return this.router.navigate(['create']);
  }

  ngOnDestroy() {
  }
}
