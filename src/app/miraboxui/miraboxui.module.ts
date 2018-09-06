import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CurrencyComponent} from './currency/currency.component';
import {SaveBoxComponent} from './save-box/save-box.component';
import {PopUpSaveBoxService} from './save-box/pop-up-save-box.service';
import {SendBoxComponent} from './send-box/send-box.component';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {MiraboxCurrencyComponent} from './mirabox-currency/mirabox-currency.component';
import {CurrencyImageDirective} from './mirabox-currency/currency-image.directive';
import {SharedModule} from '../shared/shared.module';
import {LastActionsComponent} from './last-actions/last-actions.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    CurrencyComponent,
    SaveBoxComponent,
    SendBoxComponent,
    MiraboxCurrencyComponent,
    CurrencyImageDirective,
    LastActionsComponent
  ],
  exports: [
    CurrencyComponent,
    SaveBoxComponent,
    MiraboxCurrencyComponent,
    LastActionsComponent
  ],
  providers: [
    PopUpSaveBoxService
  ]
})
export class MiraboxuiModule {
}
