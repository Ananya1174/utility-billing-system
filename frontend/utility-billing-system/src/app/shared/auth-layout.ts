import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [Navbar, RouterOutlet],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AuthLayoutComponent {}