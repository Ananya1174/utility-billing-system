import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css'
})
export class CreateAccountComponent {

  accountForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  private CREATE_ACCOUNT_URL =
    'http://localhost:8031/auth/account-requests';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      address: ['', Validators.required]
    });
  }
  get f() {
    return this.accountForm.controls;
  }

  submitRequest() {
    if (this.accountForm.invalid) return;

    this.http.post(this.CREATE_ACCOUNT_URL, this.accountForm.value)
      .subscribe({
        next: () => {
          this.successMessage =
            'Your account request has been submitted. You will receive login credentials after approval.';
          this.errorMessage = '';
          this.accountForm.reset();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log('ERROR OBJECT 👉', err);

          this.errorMessage =
            err?.error?.message || 'Something went wrong. Please try again.';
          this.successMessage = '';

          this.cdr.detectChanges();
        }
      });
  }
}