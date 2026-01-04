import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillService } from '../../../services/bill';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pay-bill-dialog.html'
})
export class PayBillDialogComponent {

  otp = '';
  paymentId: string | null = null;
  error = '';
  step = 1; // 1 = send OTP, 2 = enter OTP

  constructor(
    @Inject(MAT_DIALOG_DATA) public bill: any,
    private billService: BillService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<PayBillDialogComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  sendOtp(): void {
    const consumerId = this.authService.getUserId();

    if (!consumerId) {
      this.error = 'Session expired. Please login again.';
      return;
    }

    this.error = '';

    this.billService.initiateOnlinePayment({
      billId: this.bill.id,
      consumerId
    }).subscribe({
      next: (res: any) => {
        this.paymentId = res.paymentId;   // ✅ SOURCE OF TRUTH
        this.step = 2;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err.error?.message || '';

        if (msg.includes('OTP already sent')) {
          this.error = 'OTP already sent. Please enter the OTP.';
          this.step = 2;
        } else {
          this.error = msg || 'Failed to send OTP';
        }

        this.cdr.detectChanges();
      }
    });
  }

  confirmPayment(): void {
    if (!this.paymentId) return;

    this.error = '';

    this.billService.confirmOnlinePayment({
      paymentId: this.paymentId,
      otp: this.otp
    }).subscribe({
      next: () => {
        this.dialogRef.close({
          paid: true,
          paymentId: this.paymentId   // ✅ RETURN TO PARENT
        });
      },
      error: (err) => {
        const msg = err.error?.message || '';

        if (msg.includes('OTP expired')) {
          this.error = 'OTP expired. Please resend OTP.';
          this.step = 1;
          this.paymentId = null;
          this.otp = '';
        } else {
          this.error = msg || 'Invalid OTP';
        }

        this.cdr.detectChanges();
      }
    });
  }
}