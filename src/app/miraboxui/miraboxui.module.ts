import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from './currency/currency.component';
import { SaveBoxComponent } from './save-box/save-box.component';
import {PopUpSaveBoxService} from './save-box/pop-up-save-box.service';
import { SendBoxComponent } from './send-box/send-box.component';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { MiraboxCurrencyComponent } from './mirabox-currency/mirabox-currency.component';
import {CurrencyImageDirective} from './mirabox-currency/currency-image.directive';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule
  ],
  declarations: [CurrencyComponent, SaveBoxComponent, SendBoxComponent, MiraboxCurrencyComponent, CurrencyImageDirective],
  exports: [
    CurrencyComponent,
    SaveBoxComponent,
    MiraboxCurrencyComponent
  ],
  providers: [
    PopUpSaveBoxService
  ]
})
export class MiraboxuiModule { }
