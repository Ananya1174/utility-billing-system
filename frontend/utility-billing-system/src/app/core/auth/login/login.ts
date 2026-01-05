

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  goHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToCreateAccount() {
    this.router.navigate(['/create-account']);
  }


  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }


  loginForm: FormGroup;
  errorMessage = '';

  private LOGIN_URL = 'http://localhost:8031/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.http.post<any>(this.LOGIN_URL, this.loginForm.value)
      .subscribe({
        next: (res) => {

          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('role', res.role);
          localStorage.setItem(
            'passwordChangeRequired',
            String(res.passwordChangeRequired)
          );

          // FORCE PASSWORD CHANGE (CONSUMER ONLY)
          if (res.role === 'CONSUMER' && res.passwordChangeRequired) {
            this.router.navigate(['/change-password'], {
              queryParams: { firstLogin: true }
            });
            return;
          }

          // ROLE BASED REDIRECT
          if (res.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else if(res.role=='CONSUMER'){
            this.router.navigate(['consumer/dashboard']);
          }else if(res.role=='BILLING_OFFICER'){
            this.router.navigate(['billing/dashboard']);
          }
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
        }
      });
  }
}

