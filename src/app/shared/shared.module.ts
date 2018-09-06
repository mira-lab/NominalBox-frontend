import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FileUploadModule} from '../fileupload/fileupload.module';
import {FileUploadComponent} from '../fileupload/fileupload.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule
  ],
  declarations: [],
  exports: [FileUploadComponent, FormsModule]
})
export class SharedModule { }
