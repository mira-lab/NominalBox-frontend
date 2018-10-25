import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import {MiraboxuiModule} from './miraboxui/miraboxui.module';
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
    MiraboxuiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
