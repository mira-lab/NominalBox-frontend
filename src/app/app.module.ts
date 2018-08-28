import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FileUploadModule } from './fileupload/fileupload.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import {MiraboxuiModule} from './miraboxui/miraboxui.module';
import { DashboardAuthorizedComponent } from './dashboard-authorized/dashboard-authorized.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    DashboardPageComponent,
    CreatePageComponent,
    DashboardAuthorizedComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FileUploadModule,
    MiraboxuiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
