import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {MiraboxDataService} from '../mirabox/mirabox-data.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthRedirectService {

  private isAuthenticated = false;

  constructor(private router: Router,
              private miraBoxDataSvc: MiraboxDataService) {}

  init(): void {
    this.miraBoxDataSvc.changeInData$.subscribe((miraBox: any) => {
      this.isAuthenticated = !!miraBox;
    });
  }

  canActivate(): boolean {
    if (!this.isAuthenticated) {
      this.router.navigate(['dashboard/create']);
      return false;
    }
    return true;
  }
}
