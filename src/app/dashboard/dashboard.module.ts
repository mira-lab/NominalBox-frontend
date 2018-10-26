import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CreatePageComponent} from './create-page/create-page.component';
import { DashboardComponent } from './dashboard.component';
import {CurrencyComponent} from './create-page/currency/currency.component';
import {SaveBoxComponent} from './create-page/save-box/save-box.component';
import {SharedModule} from '../shared/shared.module';
import {MiraboxModule} from '../mirabox/mirabox.module';
import {AuthorizedPageComponent} from './authorized-page/authorized-page.component';
import {MiraboxCurrencyComponent} from './authorized-page/mirabox-currency/mirabox-currency.component';
import {CurrencyImageDirective} from './authorized-page/mirabox-currency/currency-image.directive';
import {LastActionsComponent} from './authorized-page/last-actions/last-actions.component';
import {ChangePinComponent} from './authorized-page/change-pin/change-pin.component';
import {GetPrivateKeysComponent} from './authorized-page/get-private-keys/get-private-keys.component';

@NgModule({
  imports: [
    RouterModule.forChild([
        {
          path: '', component: DashboardComponent,
          children: [
            { path: '', component: CreatePageComponent },
            { path: 'create', component:  CreatePageComponent },
            { path: 'authorized', component:  AuthorizedPageComponent },
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
  exports: [
  ]
})
export class DashboardModule { }
