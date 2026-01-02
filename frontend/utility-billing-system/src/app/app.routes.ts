import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing';
import { LoginComponent } from './auth/login/login';
import { Home } from './features/pages/home/home';
import { CreateAccountComponent } from './auth/create-account/create-account';
export const routes: Routes = [

  // Landing
  { path: '', component: LandingComponent },

  // Login
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },


  // Home (ALL ROLES)
  { path: 'home', component: Home },

  // Fallback
  { path: '**', redirectTo: '' }
];