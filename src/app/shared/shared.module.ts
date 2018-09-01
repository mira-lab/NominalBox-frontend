import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FileUploadModule} from '../fileupload/fileupload.module';
import {FileUploadComponent} from '../fileupload/fileupload.component';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule
  ],
  declarations: [],
  exports: [FileUploadComponent]
})
export class SharedModule { }
