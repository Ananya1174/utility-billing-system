import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html'
})
export class ChangePasswordComponent {

  successMsg = '';
  errorMsg = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(12)]
      ],
      confirmPassword: ['', Validators.required]
    });
  }

  passwordsMatch(): boolean {
    return (
      this.form.get('newPassword')?.value ===
      this.form.get('confirmPassword')?.value
    );
  }

  submit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.form.invalid || !this.passwordsMatch()) {
      return;
    }

    const payload = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword
    };

    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.successMsg = 'Password changed successfully';
        this.form.reset();
      },
      error: (err) => {
        this.errorMsg =
          err.error?.message || 'Failed to change password';
      }
    });
  }
}