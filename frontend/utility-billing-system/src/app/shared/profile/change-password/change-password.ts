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

  form!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', Validators.required]
    });
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
          'Password changed successfully',
          'OK',
          { duration: 3000 }
        );
        this.form.reset();
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
