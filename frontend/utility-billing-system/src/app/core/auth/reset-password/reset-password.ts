import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent {

  resetToken = '';
  loading = false;

  form;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.resetToken = this.route.snapshot.queryParamMap.get('token') || '';

    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get newPassword(): string {
    return this.form.get('newPassword')!.value || '';
  }

  get confirmPassword(): string {
    return this.form.get('confirmPassword')!.value || '';
  }

  hasMinLength = () => this.newPassword.length >= 12;
  hasUppercase = () => /[A-Z]/.test(this.newPassword);
  hasLowercase = () => /[a-z]/.test(this.newPassword);
  hasNumber    = () => /\d/.test(this.newPassword);
  hasSpecial   = () => /[^A-Za-z0-9]/.test(this.newPassword);

  passwordsMatch = () =>
    this.newPassword === this.confirmPassword &&
    this.confirmPassword.length > 0;

  canSubmit(): boolean {
    return (
      this.form.valid &&
      this.hasMinLength() &&
      this.hasUppercase() &&
      this.hasLowercase() &&
      this.hasNumber() &&
      this.hasSpecial() &&
      this.passwordsMatch()
    );
  }

  submit() {
    if (!this.canSubmit()) return;

    this.loading = true;

    const payload = {
      resetToken: this.resetToken,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open(
          'Password reset successful',
          'OK',
          { duration: 3000 }
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          err.error?.message || 'Invalid or expired token',
          'OK',
          { duration: 3000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }
}