import {Component, OnDestroy, OnInit} from '@angular/core';
import {flatMap, startWith} from 'rxjs/operators';
import {interval, from, Subject, Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';

import {MiraboxService} from '../../mirabox/mirabox.service';
import {MiraboxDataService} from '../../mirabox/mirabox-data.service';
import {MiraBox, MiraBoxItem} from '../../mirabox/mirabox';

@Component({
  selector: 'app-authorized-page',
  templateUrl: './authorized-page.component.html',
  styleUrls: ['./authorized-page.component.css']
})
export class AuthorizedPageComponent implements OnInit, OnDestroy {
  privateKey: string;
  miraBox: MiraBox;
  miraBalance = '0';
  miraBalanceSub: Subscription;
  miraLicenseBalance = '0';
  miraLicenseBalanceSub: Subscription;
  isMiraBoxOpened = true;
  showChangePinModal = false;
  showGetPKsModal = false;
  parentSubject: Subject<any> = new Subject();

  constructor(private miraBoxSvc: MiraboxService,
              private router: Router,
              private miraBoxDataSvc: MiraboxDataService) {
  }

  ngOnInit() {
    this.miraBox = this.miraBoxDataSvc.getMiraBox();
    this.checkMiraBoxOpenAndGetPK();
    this.balanceUpdateSubscriptions();
  }

// Check if MiraBox opened. If opened - show private keys in mirabox-currecy component. If not - show only addresses and action buttons.
  checkMiraBoxOpenAndGetPK(): Promise<boolean> {
    const miraBoxItem: MiraBoxItem = this.miraBox.getMiraBoxItems()[0];
    return this.miraBoxSvc.isMiraboxItemOpened(this.miraBox, miraBoxItem)
      .then((isOpened: boolean) => {
        this.isMiraBoxOpened = isOpened;
        if (isOpened) {
          return this.miraBoxSvc.getOpenedMiraBoxItemPK(miraBoxItem, this.miraBox.getPrivateKey())
            .then((privateKey: string) => {
              this.privateKey = privateKey;
              return isOpened;
            });
        } else {
          return isOpened;
        }
      })
      .catch((err) => {
        console.log(err);
        return this.router.navigate(['dashboard/create']);
      });
  }

// Every 5 sec get License and ActionCoin(eth) balances
  balanceUpdateSubscriptions(): Observable<number> {
    const intervalSource = interval(5000);
    this.miraLicenseBalanceSub = intervalSource
      .pipe(startWith(0), flatMap(() => from(this.miraBoxSvc.getLicenseBalance(this.miraBox.getPrivateKey()))))
      .subscribe((miraLicenseBalance) => {
        this.miraLicenseBalance = miraLicenseBalance + '';
      });
    this.miraBalanceSub = intervalSource
      .pipe(startWith(0), flatMap(() => from(this.miraBoxSvc.getActionCoinBalance(this.miraBox.getPrivateKey()))))
      .subscribe((miraCoinBalance) => {
        this.miraBalance = Math.floor(Number(miraCoinBalance) * 10000) + '';
      });
    return intervalSource;
  }
// If private key received from get-private-keys component
  onPrivateKey(pk: string): void {
    this.privateKey = pk;
    this.isMiraBoxOpened = true;
  }

  ngOnDestroy() {
    this.miraLicenseBalanceSub.unsubscribe();
    this.miraBalanceSub.unsubscribe();
  }
}
