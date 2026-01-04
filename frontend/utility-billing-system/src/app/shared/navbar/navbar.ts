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

  constructor(private router: Router) {
    this.role = localStorage.getItem('role');
  }

  // Role helpers (clean & readable)
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
  logoutDialog = false;
  confirmLogout() {
  this.logoutDialog = true;
}
logout() {
  this.logoutDialog = false;

  // Clear auth
  localStorage.clear();
  sessionStorage.clear();

  // Navigate to login
  window.location.href = '/login';
}
cancelLogout() {
  this.logoutDialog = false;
}
}