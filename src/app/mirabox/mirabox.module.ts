import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ModuleWithProviders} from '@angular/core';

import {Web3Service} from './web3.service';
import {MiraboxService} from './mirabox.service';
import {ServerCommunicationService} from './server-communication.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class MiraboxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MiraboxModule,
      providers: [
        MiraboxService,
        ServerCommunicationService,
        Web3Service
      ]
    };
  }
}
