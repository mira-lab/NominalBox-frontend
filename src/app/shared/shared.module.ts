import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';

import {CheckPinComponent} from './check-pin/check-pin.component';
import {FileUploadComponent} from '../fileupload/fileupload.component';
import {FileUploadModule} from '../fileupload/fileupload.module';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    CheckPinComponent
  ],
  exports: [
    CommonModule,
    FileUploadComponent,
    FormsModule,
    HttpModule,
    CheckPinComponent
  ]
})
export class SharedModule {
}
