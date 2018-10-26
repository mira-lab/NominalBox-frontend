import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AuthorizedPageComponent} from './authorized-page/authorized-page.component';
import {ChangePinComponent} from './authorized-page/change-pin/change-pin.component';
import {CreatePageComponent} from './create-page/create-page.component';
import {CurrencyComponent} from './create-page/currency/currency.component';
import {CurrencyImageDirective} from './authorized-page/mirabox-currency/currency-image.directive';
import {DashboardComponent} from './dashboard.component';
import {GetPrivateKeysComponent} from './authorized-page/get-private-keys/get-private-keys.component';
import {LastActionsComponent} from './authorized-page/last-actions/last-actions.component';
import {MiraboxModule} from '../mirabox/mirabox.module';
import {MiraboxCurrencyComponent} from './authorized-page/mirabox-currency/mirabox-currency.component';
import {NoAuthRedirectService} from './no-auth-redirect.service';
import {SaveBoxComponent} from './create-page/save-box/save-box.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: DashboardComponent,
        children: [
          {path: '', component: CreatePageComponent},
          {path: 'create', component: CreatePageComponent},
          {path: 'authorized', component: AuthorizedPageComponent, canActivate: [NoAuthRedirectService]},
        ]
      }]),
    SharedModule,
    MiraboxModule
  ],
  declarations: [
    AuthorizedPageComponent,
    MiraboxCurrencyComponent,
    MiraboxCurrencyComponent,
    CurrencyImageDirective,
    LastActionsComponent,
    ChangePinComponent,
    GetPrivateKeysComponent,
    CreatePageComponent,
    CurrencyComponent,
    DashboardComponent,
    SaveBoxComponent
  ],
  exports: []
})
export class DashboardModule {
}
