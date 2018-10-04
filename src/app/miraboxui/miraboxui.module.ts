import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CurrencyComponent} from './currency/currency.component';
import {SaveBoxComponent} from './save-box/save-box.component';
import {PopUpSaveBoxService} from './save-box/pop-up-save-box.service';
import {SendBoxComponent} from './send-box/send-box.component';
import {HttpModule} from '@angular/http';
import {MiraboxCurrencyComponent} from './mirabox-currency/mirabox-currency.component';
import {CurrencyImageDirective} from './mirabox-currency/currency-image.directive';
import {SharedModule} from '../shared/shared.module';
import {LastActionsComponent} from './last-actions/last-actions.component';
import { ChangePinComponent } from './change-pin/change-pin.component';
import { GetPrivateKeysComponent } from './get-private-keys/get-private-keys.component';
import { CheckPinComponent } from './check-pin/check-pin.component';
import { RepackMiraboxComponent } from './repack-mirabox/repack-mirabox.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    SharedModule
  ],
  declarations: [
    CurrencyComponent,
    SaveBoxComponent,
    SendBoxComponent,
    MiraboxCurrencyComponent,
    CurrencyImageDirective,
    LastActionsComponent,
    ChangePinComponent,
    GetPrivateKeysComponent,
    RepackMiraboxComponent,
    CheckPinComponent
  ],
  exports: [
    CurrencyComponent,
    SaveBoxComponent,
    MiraboxCurrencyComponent,
    LastActionsComponent,
    ChangePinComponent,
    GetPrivateKeysComponent,
    RepackMiraboxComponent,
    CheckPinComponent
  ],
  providers: [
    PopUpSaveBoxService
  ]
})
export class MiraboxuiModule {
}
