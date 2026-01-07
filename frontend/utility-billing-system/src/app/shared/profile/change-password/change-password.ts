import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent {

  form: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', Validators.required]
    });
  }

  passwordTouched(): boolean {
    return this.form.get('newPassword')?.touched === true;
  }

  hasMinLength(): boolean {
    const value = this.form.get('newPassword')?.value || '';
    return value.length >= 12;
  }

  hasUppercase(): boolean {
    const value = this.form.get('newPassword')?.value || '';
    return /[A-Z]/.test(value);
  }

  hasLowercase(): boolean {
    const value = this.form.get('newPassword')?.value || '';
    return /[a-z]/.test(value);
  }

  hasNumber(): boolean {
    const value = this.form.get('newPassword')?.value || '';
    return /[0-9]/.test(value);
  }

  hasSpecialChar(): boolean {
    const value = this.form.get('newPassword')?.value || '';
    return /[^A-Za-z0-9]/.test(value);
  }

  passwordsMatch(): boolean {
    return (
      this.form.value.newPassword === this.form.value.confirmPassword
    );
  }

  submit(): void {
    if (this.form.invalid || !this.passwordsMatch()) return;

    this.submitting = true;

    const payload = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword
    };

    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.submitting = false;

        this.snackBar.open(
          'Password changed successfully. Please login again.',
          'OK',
          { duration: 3000 }
        );

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('passwordChangeRequired');

        this.form.reset();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 300);
      },
      error: (err) => {
        this.submitting = false;
        this.snackBar.open(
          err?.error?.message || 'Failed to change password',
          'OK',
          { duration: 3000 }
        );
      }
    });
  }
}