import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing';
import { LoginComponent } from './core/auth/login/login';
import { Home } from './shared/home/home';
import { CreateAccountComponent } from './core/auth/create-account/create-account';
import { UserManagementComponent } from './features/admin/user-management/user-management';
import { ProfileComponent } from './shared/profile/profile/profile';
import { ChangePasswordComponent } from './shared/profile/change-password/change-password';
import { AccountRequestsComponent } from './features/admin/account-requests/account-requests';
import { ForcePasswordChangeGuard } from './core/guards/force-password-change-guard';
import { TariffManagementComponent } from './features/admin/tariff-management/tariff-management';
import { UtilityRequestsComponent } from './features/admin/utility-requests/utility-requests';
import { BillingPaymentsComponent } from './features/admin/billing-payments/billing-payments';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { AdminReportsComponent } from './features/admin/admin-reports/admin-reports';
export const routes: Routes = [

  // ---------------- Landing ----------------
  { path: '', component: LandingComponent },

  // ---------------- Auth ----------------
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  {
    path: 'admin/account-requests',
    component: AccountRequestsComponent
  },
  {
    path: 'admin/users',
    component: UserManagementComponent
  },
  {
    path: 'admin/utility-requests',
    component: UtilityRequestsComponent
  },
  {
    path: 'admin/tariffs',
    component: TariffManagementComponent
  },
  {
    path: 'admin/billing',
    component: BillingPaymentsComponent
  },
  {
  path: 'admin',
  children: [
    {
      path: 'dashboard',
      component: AdminDashboardComponent
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    }
  ]
},
{
    path: 'admin/reports',
    component: AdminReportsComponent
  },

  // ---------------- Forced Password Change ----------------
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },

  // ---------------- Home (ALL ROLES but guarded) ----------------
  {
    path: 'home',
    component: Home,
    canActivate: [ForcePasswordChangeGuard]
  },

  // ---------------- Profile (COMMON) ----------------
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ForcePasswordChangeGuard],
    children: [
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },

      // future-ready default
      { path: '', redirectTo: 'change-password', pathMatch: 'full' }
    ]
  },

  // ---------------- Fallback ----------------
  { path: '**', redirectTo: '' }
];