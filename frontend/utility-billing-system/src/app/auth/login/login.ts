import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

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

        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
}
}