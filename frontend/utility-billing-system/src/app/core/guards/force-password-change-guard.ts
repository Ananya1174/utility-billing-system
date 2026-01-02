import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ForcePasswordChangeGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const role = localStorage.getItem('role');
    const required =
      localStorage.getItem('passwordChangeRequired') === 'true';

    if (role === 'CONSUMER' && required) {
      this.router.navigate(['/change-password'], {
        queryParams: { firstLogin: true }
      });
      return false;
    }

    return true;
  }
}