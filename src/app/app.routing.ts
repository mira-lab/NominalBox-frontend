import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomePageComponent} from './home-page/home-page.component';

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
