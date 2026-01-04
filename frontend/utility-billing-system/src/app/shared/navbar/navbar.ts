import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  role: string | null = null;
  logoutDialog = false;

  constructor(private router: Router) {
    this.role = localStorage.getItem('role');
  }

  /* ===== ROLE HELPERS ===== */
  isAdmin() {
    return this.role === 'ADMIN';
  }

  isConsumer() {
    return this.role === 'CONSUMER';
  }

  isBillingOfficer() {
    return this.role === 'BILLING_OFFICER';
  }

  isAccountsOfficer() {
    return this.role === 'ACCOUNTS_OFFICER';
  }

  /* ===== LOGOUT FLOW ===== */
  confirmLogout() {
    this.logoutDialog = true;
  }

  cancelLogout() {
    this.logoutDialog = false;
  }

  logout() {
  this.logoutDialog = false;

  localStorage.clear();
  sessionStorage.clear();

  // Redirect to landing
  this.router.navigate(['/']);
}
}