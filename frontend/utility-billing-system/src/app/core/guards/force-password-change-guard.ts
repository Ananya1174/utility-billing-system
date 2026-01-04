import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ForcePasswordChangeGuard implements CanActivateChild {

  constructor(private router: Router) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const role = localStorage.getItem('role');
    const passwordChangeRequired =
      localStorage.getItem('passwordChangeRequired') === 'true';

    const url = state.url;

    // ✅ Always allow auth & password pages
    if (
      url.startsWith('/login') ||
      url.startsWith('/forgot-password') ||
      url.startsWith('/reset-password')
    ) {
      return true;
    }

    // 🔐 ONLY consumer restriction
    if (role === 'CONSUMER' && passwordChangeRequired) {

      // allow ONLY change-password
      if (url.startsWith('/change-password')) {
        return true;
      }

      // block everything else
      this.router.navigate(['/change-password'], {
        queryParams: { firstLogin: true }
      });
      return false;
    }

    return true;
  }
}