import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FileUploadModule} from '../fileupload/fileupload.module';
import {FileUploadComponent} from '../fileupload/fileupload.component';
import {FormsModule} from '@angular/forms';
import {CheckPinComponent} from '../dashboard/check-pin/check-pin.component';
import {HttpModule} from '@angular/http';

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
export class SharedModule { }
