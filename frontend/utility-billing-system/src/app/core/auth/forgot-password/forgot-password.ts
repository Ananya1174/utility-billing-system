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
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {

  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // ✅ Initialize form INSIDE constructor
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) return;

    const email = this.form.get('email')!.value;

    if (!email) return;

    this.loading = true;

    this.authService.forgotPassword({ email }).subscribe({
      next: (res: string) => {
  this.loading = false;
  this.snackBar.open(
    res || 'Password reset link sent to email',
    'OK',
    { duration: 3000 }
  );
  this.form.reset();
},
      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          err.error?.message || 'Email not found',
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