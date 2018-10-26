import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CurrencyComponent} from '../dashboard/create-page/currency/currency.component';
import {SaveBoxComponent} from '../dashboard/create-page/save-box/save-box.component';
import {PopUpSaveBoxService} from '../dashboard/create-page/save-box/pop-up-save-box.service';
import {HttpModule} from '@angular/http';
import {MiraboxCurrencyComponent} from '../dashboard/authorized-page/mirabox-currency/mirabox-currency.component';
import {CurrencyImageDirective} from '../dashboard/authorized-page/mirabox-currency/currency-image.directive';
import {SharedModule} from '../shared/shared.module';
import {LastActionsComponent} from '../dashboard/authorized-page/last-actions/last-actions.component';
import { ChangePinComponent } from '../dashboard/authorized-page/change-pin/change-pin.component';
import { GetPrivateKeysComponent } from '../dashboard/authorized-page/get-private-keys/get-private-keys.component';
import { CheckPinComponent } from '../dashboard/check-pin/check-pin.component';

@NgModule({
  imports: [
    HttpModule,
    SharedModule
  ],
  declarations: [
    // CurrencyComponent,
    // SaveBoxComponent,
    // MiraboxCurrencyComponent,
    // CurrencyImageDirective,
    // LastActionsComponent,
    // ChangePinComponent,
    // GetPrivateKeysComponent,
    // CheckPinComponent
  ],
  exports: [
    // CurrencyComponent,
    // SaveBoxComponent,
    // MiraboxCurrencyComponent,
    // LastActionsComponent,
    // ChangePinComponent,
    // GetPrivateKeysComponent,
    // CheckPinComponent
  ],
  providers: [
    PopUpSaveBoxService
  ]
})
export class MiraboxuiModule {
}
