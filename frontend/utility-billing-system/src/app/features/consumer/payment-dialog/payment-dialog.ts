import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentsService } from '../../../services/payments';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-dialog.html',
  styleUrls: ['./payment-dialog.css']
})
export class PaymentDialogComponent {

  step: 'INIT' | 'OTP' = 'INIT';

  otpDigits = ['', '', '', '', '', ''];
  paymentId = '';
  loading = false;
  errorMsg = '';

  resendCounter = 0;
  timer: any;

  constructor(
    private paymentsService: PaymentsService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public bill: any
  ) {}

  get otp(): string {
    return this.otpDigits.join('');
  }

  initiatePayment(): void {
    this.loading = true;
    this.errorMsg = '';

    this.paymentsService.initiateOnlinePayment({
      billId: this.bill.id,
      consumerId: this.authService.getUserId()
    }).subscribe({
      next: (res) => {
        this.paymentId = res.paymentId;
        this.step='OTP';
        this.loading = false;
        this.startResendTimer();
        this.cdr.detectChanges();
        this.moveToOtp();
      },
      error: (err) => {
        const msg = err.error?.message || '';

        if (msg.includes('OTP already sent')) {
          this.moveToOtp();
        } else {
          this.errorMsg = msg || 'Failed to send OTP';
        }
      }
    });
  }

  moveToOtp() {
    this.step = 'OTP';
    this.loading = false;
    this.startResendTimer();
    this.cdr.detectChanges();
  }

  onOtpInput(event: any, index: number) {
    const value = event.target.value;

    if (!/^[0-9]$/.test(value)) {
      this.otpDigits[index] = '';
      return;
    }

    if (index < 5) {
      event.target.nextElementSibling?.focus();
    }
  }

  confirmOtp(): void {
    if (this.otp.length !== 6) return;

    this.loading = true;
    this.errorMsg = '';

    this.paymentsService.confirmOnlinePayment({
      paymentId: this.paymentId,
      otp: this.otp
    }).subscribe({
      next: () => {
        this.dialogRef.close({
          paid: true,
          paymentId: this.paymentId
        });
      },
      error: (err) => {
        const msg = err.error?.message || '';

        if (msg.includes('OTP expired')) {
          this.reset();
        } else {
          this.errorMsg = msg || 'Invalid OTP';
        }
      }
    });
  }

  resendOtp(): void {
    this.reset();
    this.initiatePayment();
  }

  reset() {
    this.step = 'INIT';
    this.paymentId = '';
    this.otpDigits = ['', '', '', '', '', ''];
    this.resendCounter = 0;
    clearInterval(this.timer);
    this.loading = false;
    this.cdr.detectChanges();
  }

  startResendTimer() {
    this.resendCounter = 30;

    this.timer = setInterval(() => {
      this.resendCounter--;
      if (this.resendCounter === 0) {
        clearInterval(this.timer);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  cancel(): void {
    clearInterval(this.timer);
    this.dialogRef.close(false);
  }
}