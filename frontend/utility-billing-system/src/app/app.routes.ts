import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing';
import { LoginComponent } from './auth/login/login';
import { Home } from './features/pages/home/home';
import { CreateAccountComponent } from './auth/create-account/create-account';

import { ProfileComponent } from './profile/profile/profile';
import { ChangePasswordComponent } from './profile/change-password/change-password';
export const routes: Routes = [

  // Landing
  { path: '', component: LandingComponent },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },

  // Home (ALL ROLES)
  { path: 'home', component: Home },

  // Profile (COMMON)
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'change-password', component: ChangePasswordComponent },

      // future-ready
      { path: '', redirectTo: 'change-password', pathMatch: 'full' }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];