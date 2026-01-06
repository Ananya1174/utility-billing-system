import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-offline-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './offline-payment.html',
  styleUrls: ['./offline-payment.css']
})
export class OfflinePaymentComponent {

  paymentForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';

  private baseUrl = 'http://localhost:8031';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.paymentForm = this.fb.group({
      billId: ['', Validators.required],
      consumerId: ['', Validators.required],
      remarks: ['Cash payment at counter', Validators.required]
    });
  }

  submit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.http.post(`${this.baseUrl}/payments/offline`, this.paymentForm.value)
      .subscribe({
        next: () => {
          this.successMsg = 'Offline payment recorded successfully';
          this.paymentForm.reset({
            remarks: 'Cash payment at counter'
          });
          this.loading = false;
        },
        error: err => {
          this.errorMsg = err?.error?.message || 'Failed to record payment';
          this.loading = false;
        }
      });
  }
  get f() {
    return this.paymentForm.controls;
  }
}