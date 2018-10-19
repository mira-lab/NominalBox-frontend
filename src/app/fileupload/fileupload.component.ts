import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileUploadComponent implements OnInit {
  fileToUpload: File = null;
  @Input() size = 'large';
  @Input() text = 'To get started with MiraBox, drag & drop file here';
  @Input() downloadButton = true;
  @Output() fileContentReceived: EventEmitter<string> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    const reader = new FileReader();
    reader.readAsText(this.fileToUpload);
    reader.onload = () => {
      return this.fileContentReceived.emit(reader.result);
    };
    reader.onerror = () => {
      return alert('Error reading from file!');
    };
  }

  onFileDrop(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      return this.fileContentReceived.emit(reader.result);
    };
    reader.onerror = () => {
      return alert('Error reading from file!');
    };
  }
}
