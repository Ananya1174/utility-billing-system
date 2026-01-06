import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillService } from '../../../services/bill';
import { AuthService } from '../../../services/auth';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pay-bill-dialog.html',
  styleUrls: ['./pay-bill-dialog.css']
})
export class PayBillDialogComponent {

  step: 'SEND' | 'OTP' = 'SEND';

  otp = '';
  paymentId: string | null = null;

  loading = false;
  error = '';

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

    this.loading = true;
    this.error = '';

    this.billService.initiateOnlinePayment({
      billId: this.bill.id,
      consumerId
    }).subscribe({
      next: (res: any) => {
        this.paymentId = res.paymentId;
        this.step = 'OTP';
        this.loading = false;
        this.otp = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to send OTP';

        if (msg.toLowerCase().includes('otp')) {
          this.step = 'OTP';
        } else {
          this.error = msg;
        }

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  confirmPayment(): void {
    if (!this.paymentId || this.otp.length !== 6) {
      this.error = 'Please enter 6-digit OTP';
      return;
    }

    this.loading = true;
    this.error = '';

    this.billService.confirmOnlinePayment({
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
        const msg = err.error?.message || 'Invalid OTP';

        if (msg.toLowerCase().includes('expired')) {
          this.step = 'SEND';
          this.paymentId = null;
          this.otp = '';
        }

        this.error = msg;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}