import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {MiraBox} from '../mirabox/mirabox';
import {MiraboxDataService} from '../core/mirabox-data.service';
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

  onFileContentReceived(fileContent: string): any {
    try {
      this.miraBox = MiraBox.fromString(fileContent);
      this.miraBoxDataSvc.setMiraBox(this.miraBox);
      this.miraBoxSvc.isMiraboxItemOpened(this.miraBox, this.miraBox.getMiraBoxItems()[0])
        .then((res) => {
          if (res) {
            this.showCheckPin = true;
          } else {
            return this.router.navigate(['dashboard/authorized']);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      return alert('Bad MiraBox File!');
    }
  }

}
