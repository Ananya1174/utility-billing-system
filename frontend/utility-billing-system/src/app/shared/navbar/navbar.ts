import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  role: string | null = null;

  constructor(private router: Router) {
    this.role = localStorage.getItem('role');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
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
}