import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FileUploadModule } from './fileupload/fileupload.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    DashboardPageComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FileUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
