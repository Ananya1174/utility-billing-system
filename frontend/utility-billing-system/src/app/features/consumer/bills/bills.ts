import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BillService } from '../../../services/bill';
import { AuthService } from '../../../services/auth';
import { PayBillDialogComponent } from '../pay-bill-dialog/pay-bill-dialog';
import { BillDetailsDialogComponent } from '../bill-details-dialog/bill-details-dialog';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './bills.html',
  styleUrls: ['./bills.css']
})
export class BillsComponent implements OnInit {

  bills: any[] = [];
  loading = true;

  constructor(
    private billService: BillService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    const consumerId = this.authService.getUserId();
    if (!consumerId) return;

    this.billService.getConsumerBills(consumerId).subscribe({
      next: (res) => {
        this.bills = res.sort(
          (a, b) =>
            b.billingYear - a.billingYear ||
            b.billingMonth - a.billingMonth
        );

        this.bills.forEach(bill => {
          if (bill.status === 'PAID') {
            this.billService.getPaymentsByBillId(bill.id)
              .subscribe(payments => {
                const successPayment = payments.find(
                  p => p.status === 'SUCCESS'
                );

                if (successPayment) {
                  bill.paymentId = successPayment.paymentId;
                  this.cdr.detectChanges();
                }
              });
          }
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewBill(billId: string): void {
    this.dialog.open(BillDetailsDialogComponent, {
      width: '500px',
      data: { billId }
    });
  }

  payBill(bill: any): void {
    const dialogRef = this.dialog.open(PayBillDialogComponent, {
      width: '400px',
      data: bill
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.paid && res.paymentId) {
        bill.status = 'PAID';
        bill.paymentId = res.paymentId;
        this.cdr.detectChanges();
      }
    });
  }

  isPayable(status: string): boolean {
    return status === 'DUE' || status === 'OVERDUE';
  }

  viewInvoice(paymentId?: string): void {
    if (!paymentId) return;

    this.dialog.open(InvoiceDialogComponent, {
      width: '500px',
      data: { paymentId }
    });
  }

  downloadInvoice(paymentId?: string): void {
    if (!paymentId) return;

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