import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from './currency/currency.component';
import { SaveBoxComponent } from './save-box/save-box.component';
import {PopUpSaveBoxService} from './save-box/pop-up-save-box.service';
import { SendBoxComponent } from './send-box/send-box.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CurrencyComponent, SaveBoxComponent, SendBoxComponent],
  exports: [
    CurrencyComponent,
    SaveBoxComponent
  ],
  providers: [
    PopUpSaveBoxService
  ]
})
export class MiraboxuiModule { }
