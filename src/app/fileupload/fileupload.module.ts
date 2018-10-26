import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DndDirective} from './dnd.directive';
import {FileUploadComponent} from './fileupload.component';

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
export class FileUploadModule {
}
