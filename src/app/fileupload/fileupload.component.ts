import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileUploadComponent implements OnInit {
  fileToUpload: File = null;
  @Input() size = 'large';
  @Input() text = 'Drag & drop file here';
  @Input() downloadButton = true;
  @Output() fileContentReceived: EventEmitter<string> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  handleFileInput(files: FileList): any {
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

  onFileDrop(file: File): any {
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
