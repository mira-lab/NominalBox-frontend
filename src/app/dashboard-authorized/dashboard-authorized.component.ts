import {Component, OnDestroy, OnInit} from '@angular/core';
import {MiraboxService} from '../miraboxui/mirabox.service';
import {Router} from '@angular/router';
import {interval, from} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {MiraboxDataService} from '../miraboxui/mirabox-data.service';
import {MiraBox} from '../miraboxui/mirabox';

@Component({
  selector: 'app-dashboard-authorized',
  templateUrl: './dashboard-authorized.component.html',
  styleUrls: ['./dashboard-authorized.component.css']
})
export class DashboardAuthorizedComponent implements OnInit, OnDestroy {
  miraBalance: any = '0';
  miraLicenseBalance: any = '0';
  miraBox: MiraBox;

  constructor(private miraBoxSvc: MiraboxService,
              private router: Router,
              private miraBoxDataSvc: MiraboxDataService) {
  }

  ngOnInit() {
    if (!this.miraBoxDataSvc.getMiraBox()) {
      return this.router.navigate(['create']);
    }
    this.miraBox = this.miraBoxDataSvc.getMiraBox();

    console.log(this.miraBox);

    const intervalSource = interval(5000);
    intervalSource
      .pipe(flatMap(() => from(this.miraBoxSvc.getLicenseBalance(this.miraBox.getPrivateKey()))))
      .subscribe((miraLicenseBalance) => {
        this.miraLicenseBalance = miraLicenseBalance;
      });
    intervalSource
      .pipe(flatMap(() => from(this.miraBoxSvc.getActionCoinBalance(this.miraBox.getPrivateKey()))))
      .subscribe((miraCoinBalance) => {
        this.miraBalance = miraCoinBalance;
      });
  }

  changePin() {
  }

  getAllPrivateKeys() {
    this.miraBoxSvc.openMiraBox(this.miraBox)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnDestroy() {
  }
}
