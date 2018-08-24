import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ModuleWithProviders } from '@angular/core';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'dashboard', component: DashboardPageComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
