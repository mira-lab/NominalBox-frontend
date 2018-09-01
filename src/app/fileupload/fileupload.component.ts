import {Component, OnInit, Input} from '@angular/core';
import {MiraboxDataService} from '../miraboxui/mirabox-data.service';
import {MiraBox} from '../miraboxui/mirabox';
import {Router} from '@angular/router';

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

  constructor(private miraBoxDataSvc: MiraboxDataService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onClick() {
    console.log('clicked');
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    const reader = new FileReader();
    reader.readAsText(this.fileToUpload);
    reader.onload = () => {
      try {
        this.miraBoxDataSvc.setMiraBox(MiraBox.fromString(reader.result));
        return this.router.navigate(['dashboard-authorized']);
      } catch (err) {
        alert('Bad MiraBox File!');
      }
    };
  }

  onFileDrop(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      try {
        this.miraBoxDataSvc.setMiraBox(MiraBox.fromString(reader.result));
        return this.router.navigate(['dashboard-authorized']);
      } catch (err) {
        alert('Bad MiraBox File!');
      }
    };
  }
}
