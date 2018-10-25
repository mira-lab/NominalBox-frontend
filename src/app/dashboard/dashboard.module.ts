import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CreatePageComponent} from './create-page/create-page.component';
import { DashboardComponent } from './dashboard.component';
import {CurrencyComponent} from './create-page/currency/currency.component';
import {SaveBoxComponent} from './create-page/save-box/save-box.component';
import {SharedModule} from '../shared/shared.module';
import {MiraboxModule} from '../mirabox/mirabox.module';
import {AuthorizedPageComponent} from './authorized-page/authorized-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
        {
          path: '', component: DashboardComponent,
          children: [

            { path: '', component: CreatePageComponent }
            ,
            { path: 'create', component:  CreatePageComponent}]
        }]),
    SharedModule,
    MiraboxModule
  ],
  declarations: [
    AuthorizedPageComponent,
    CreatePageComponent,
    CurrencyComponent,
    DashboardComponent,
    SaveBoxComponent
  ]
})
export class DashboardModule { }
