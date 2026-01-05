import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing';
import { LoginComponent } from './core/auth/login/login';
import { CreateAccountComponent } from './core/auth/create-account/create-account';
import { Home } from './shared/home/home';
import { ProfileComponent } from './shared/profile/profile/profile';
import { ChangePasswordComponent } from './shared/profile/change-password/change-password';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { AdminReportsComponent } from './features/admin/admin-reports/admin-reports';
import { UserManagementComponent } from './features/admin/user-management/user-management';
import { AccountRequestsComponent } from './features/admin/account-requests/account-requests';
import { TariffManagementComponent } from './features/admin/tariff-management/tariff-management';
import { UtilityRequestsComponent } from './features/admin/utility-requests/utility-requests';
import { BillingPaymentsComponent } from './features/admin/billing-payments/billing-payments';
import { ForcePasswordChangeGuard } from './core/guards/force-password-change-guard';
import { AuthLayoutComponent } from './shared/auth-layout';
import { ForgotPasswordComponent } from './core/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './core/auth/reset-password/reset-password';

// CONSUMER
import { ConsumerDashboard } from './features/consumer/consumer-dashboard/consumer-dashboard';
import { MyUtilitiesComponent } from './features/consumer/my-utilities/my-utilities';
import { BillsComponent } from './features/consumer/bills/bills';
import { PaymentsComponent } from './features/consumer/payments/payments';

export const routes: Routes = [

  // ---------- PUBLIC ----------
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent },

  // ---------- AUTHENTICATED (NAVBAR INCLUDED) ----------
  {
    path: '',
    component: AuthLayoutComponent,
    canActivateChild: [ForcePasswordChangeGuard],
    children: [

      // TEMP (remove later)
      { path: 'home', component: Home },

      { path: 'change-password', component: ChangePasswordComponent },

      // ---------- CONSUMER ----------
      { path: 'consumer/dashboard', component: ConsumerDashboard },
      { path: 'consumer/utilities', component: MyUtilitiesComponent },
      { path: 'consumer/bills', component: BillsComponent },
      { path: 'consumer/payments', component: PaymentsComponent },
      { path: 'consumer', redirectTo: 'consumer/dashboard', pathMatch: 'full' },

      // ---------- ADMIN ----------
      { path: 'admin/dashboard', component: AdminDashboardComponent },
      { path: 'admin/reports', component: AdminReportsComponent },
      { path: 'admin/users', component: UserManagementComponent },
      { path: 'admin/account-requests', component: AccountRequestsComponent },
      { path: 'admin/utility-requests', component: UtilityRequestsComponent },
      { path: 'admin/tariffs', component: TariffManagementComponent },
      { path: 'admin/billing', component: BillingPaymentsComponent },
    ]
  },

  // ---------- FALLBACK ----------
  { path: '**', redirectTo: '' }
];