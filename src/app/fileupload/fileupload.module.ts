import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './fileupload.component';
import {DndDirective} from './dnd.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FileUploadComponent,
    DndDirective
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
