import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @Output() private filesChangeEmiter: EventEmitter<File> = new EventEmitter();
  constructor() { }
  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.filesChangeEmiter.emit(files[0]);
    }
  }

}
