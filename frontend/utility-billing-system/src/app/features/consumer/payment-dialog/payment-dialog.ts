import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth';
import { PaymentsService } from '../../../services/payments';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-dialog.html',
  styleUrls: ['./payment-dialog.css']
})
export class PaymentDialogComponent {

  step: 'INIT' | 'OTP' = 'INIT';
  otp = '';
  paymentId = '';
  loading = false;
  errorMsg = '';

  constructor(
    private paymentsService: PaymentsService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public bill: any
  ) {}

  initiatePayment(): void {
    this.loading = true;

    this.paymentsService.initiateOnlinePayment({
      billId: this.bill.id,
      consumerId: this.authService.getUserId()
    }).subscribe({
      next: (res) => {
        this.paymentId = res.paymentId;
        this.step = 'OTP';
        this.loading = false;
        this.cdr.detectChanges(); // 🔑
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to initiate payment';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmOtp(): void {
    this.loading = true;

    this.paymentsService.confirmOnlinePayment({
      paymentId: this.paymentId,
      otp: this.otp
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Invalid OTP';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}