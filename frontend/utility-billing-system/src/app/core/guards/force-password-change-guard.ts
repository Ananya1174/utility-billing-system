import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ForcePasswordChangeGuard implements CanActivateChild {

  constructor(private router: Router) { }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const role = localStorage.getItem('role');
    const passwordChangeRequired =
      localStorage.getItem('passwordChangeRequired') === 'true';

    const url = state.url;
    if (
      url.startsWith('/login') ||
      url.startsWith('/forgot-password') ||
      url.startsWith('/reset-password')
    ) {
      return true;
    }
    if (role === 'CONSUMER' && passwordChangeRequired) {
      if (url.startsWith('/change-password')) {
        return true;
      }

      this.router.navigate(['/change-password'], {
        queryParams: { firstLogin: true }
      });
      return false;
    }

    return true;
  }
}