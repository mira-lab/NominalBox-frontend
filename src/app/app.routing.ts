import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ModuleWithProviders } from '@angular/core';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {CreatePageComponent} from './create-page/create-page.component';
import {DashboardAuthorizedComponent} from './dashboard-authorized/dashboard-authorized.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'create', component: CreatePageComponent },
  { path: 'dashboard-authorized', component: DashboardAuthorizedComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
