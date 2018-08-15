import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomePageComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
