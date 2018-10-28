import {Component} from '@angular/core';
import {NoAuthRedirectService} from './dashboard/no-auth-redirect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NominalBox-frontend';

  constructor(private noAuthRedirectSvc: NoAuthRedirectService) {
    this.initializeApp();
  }

  initializeApp() {
    this.noAuthRedirectSvc.init(); // TODO: add platform service
  }
}

