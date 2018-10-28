import {BrowserModule} from '@angular/platform-browser';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HomePageComponent} from './home-page/home-page.component';
import {routing} from './app.routing';
import {SharedModule} from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    SharedModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
