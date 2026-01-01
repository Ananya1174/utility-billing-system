import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [

  // Default page → Landing
  { path: '', component: LandingComponent },

  // Auth pages
  { path: 'login', component: LoginComponent },
 
  // Fallback
  { path: '**', redirectTo: '' }
];