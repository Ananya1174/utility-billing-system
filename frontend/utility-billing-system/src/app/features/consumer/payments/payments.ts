import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsService } from '../../../services/payments';
import { AuthService } from '../../../services/auth';
import { BillService } from '../../../services/bill';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class PaymentsComponent implements OnInit {

  payments: any[] = [];
  loading = true;

  constructor(
    private paymentsService: PaymentsService,
    private authService: AuthService,
    private billService: BillService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    const consumerId = this.authService.getUserId();
    if (!consumerId) return;

    this.paymentsService.getPaymentsByConsumer(consumerId).subscribe({
      next: (res) => {
        this.payments = res.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewInvoice(paymentId: string): void {
    this.dialog.open(InvoiceDialogComponent, {
      width: '500px',
      data: { paymentId }
    });
  }

  downloadInvoice(paymentId: string): void {
    this.billService.downloadInvoice(paymentId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}