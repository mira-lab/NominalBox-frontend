import {Component, OnDestroy, OnInit} from '@angular/core';
import {flatMap, startWith} from 'rxjs/operators';
import {interval, from, Subject} from 'rxjs';
import {Router} from '@angular/router';

import {MiraboxService} from '../../mirabox/mirabox.service';
import {MiraboxDataService} from '../../mirabox/mirabox-data.service';
import {MiraBox} from '../../mirabox/mirabox';

@Component({
  selector: 'app-authorized-page',
  templateUrl: './authorized-page.component.html',
  styleUrls: ['./authorized-page.component.css']
})
export class AuthorizedPageComponent implements OnInit, OnDestroy {
  miraBalance: any = '0';
  miraLicenseBalance: any = '0';
  miraBox: MiraBox;
  miraBoxAddress: string;
  privateKey;
  gettingPrivateKeys = false;
  isGetPrivateKeysDisabled = true;
  changingPin = false;
  getPrivateKeys = false;
  parentSubject: Subject<any> = new Subject();
  isMiraBoxOpened = true;

  constructor(private miraBoxSvc: MiraboxService,
              private router: Router,
              private miraBoxDataSvc: MiraboxDataService) {
  }

  ngOnInit() {
    this.miraBox = this.miraBoxDataSvc.getMiraBox();
    this.miraBoxAddress = this.miraBoxSvc.getMiraBoxAddress(this.miraBox);
    this.miraBoxSvc.isMiraboxItemOpened(this.miraBox, this.miraBox.getMiraBoxItems()[0])
      .then((res) => {
        if (res) {
          return this.miraBoxSvc.getOpenedMiraBoxItemPK(this.miraBox.getMiraBoxItems()[0]);
        } else {
          this.isGetPrivateKeysDisabled = false;
          this.isMiraBoxOpened = false;
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

  onPrivateKey(pk: string) {
    this.privateKey = pk;
    this.isMiraBoxOpened = true;
  }

  ngOnDestroy() {
  }
}
