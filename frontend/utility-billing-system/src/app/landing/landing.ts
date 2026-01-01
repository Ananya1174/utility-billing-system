import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {

  constructor(private router: Router) {}

  goToCreateAccount() {
    this.router.navigate(['/create-account']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}