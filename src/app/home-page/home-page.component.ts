import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MiraBox} from '../mirabox/mirabox';
import {FileUploadComponent} from '../fileupload/fileupload.component';
import {MiraboxDataService} from '../miraboxui/mirabox-data.service';
import {MiraboxService} from '../mirabox/mirabox.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  showCheckPin = false;
  miraBox: MiraBox;

  constructor(private router: Router,
              private miraBoxDataSvc: MiraboxDataService,
              private miraBoxSvc: MiraboxService) {
  }

  ngOnInit() {
  }

  onFileContentReceived(fileContent: string) {
    try {
      this.miraBoxDataSvc.setMiraBox(MiraBox.fromString(fileContent));
      this.miraBox = this.miraBoxDataSvc.getMiraBox();
      this.miraBoxSvc.isMiraboxItemOpened(this.miraBox, this.miraBox.getMiraBoxItems()[0])
        .then((res) => {
          if (res) {
            this.showCheckPin = true;
          } else {
            this.showCheckPin = false;
            this.router.navigate(['dashboard-authorized']);
            return Promise.reject('Mirabox not opened');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      return alert('Bad MiraBox File!');
    }
  }

  pinChecked(result) {
    if (result === true) {
      this.showCheckPin = false;
      return this.router.navigate(['dashboard-authorized']);
    }
  }

  closeCheckPin() {
    this.showCheckPin = false;
  }
}
