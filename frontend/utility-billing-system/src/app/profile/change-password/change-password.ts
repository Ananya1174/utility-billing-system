import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileComponent } from '../profile/profile';

import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
  FormGroup
} from '@angular/forms';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule   // ✅ REQUIRED
  ],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent {

  form!: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef   // ✅ IMPORTANT
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // ---------- getters ----------
  get oldPassword(): string {
    return this.form.get('oldPassword')!.value;
  }

  get newPassword(): string {
    return this.form.get('newPassword')!.value;
  }

  get confirmPassword(): string {
    return this.form.get('confirmPassword')!.value;
  }

  // ---------- password rules ----------
  hasMinLength = () => this.newPassword.length >= 12;
  hasUppercase = () => /[A-Z]/.test(this.newPassword);
  hasLowercase = () => /[a-z]/.test(this.newPassword);
  hasNumber    = () => /\d/.test(this.newPassword);
  hasSpecial   = () => /[^A-Za-z0-9]/.test(this.newPassword);

  passwordsMatch = () =>
    this.newPassword === this.confirmPassword &&
    this.confirmPassword.length > 0;

  oldNewDifferent = () =>
    this.oldPassword !== this.newPassword;

  canSubmit(): boolean {
    return (
      this.form.valid &&
      this.hasMinLength() &&
      this.hasUppercase() &&
      this.hasLowercase() &&
      this.hasNumber() &&
      this.hasSpecial() &&
      this.passwordsMatch() &&
      this.oldNewDifferent()
    );
  }

  // ---------- submit ----------
  submit(): void {
    if (!this.canSubmit()) return;

    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.authService.changePassword(payload).subscribe({
  next: (msg: string) => {

    this.snackBar.open(
      msg || 'Password updated successfully',
      'OK',
      {
        duration: 3000,
        panelClass: ['success-snackbar']
      }
    );

    this.form.reset();

    setTimeout(() => {
      this.router.navigate(['/profile']);
    }, 1500);
  },
  error: (err) => {
    this.snackBar.open(
      err?.error || 'Failed to change password',
      'OK',
      {
        duration: 3000,
        panelClass: ['error-snackbar']
      }
    );
  }
});
  }
}