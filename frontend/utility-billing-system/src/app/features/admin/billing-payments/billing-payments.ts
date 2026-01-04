import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-billing-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing-payments.html',
  styleUrl: './billing-payments.css'
})
export class BillingPaymentsComponent {

  consumerId = '';
  activeTab: 'BILLS' | 'PAYMENTS' | 'OUTSTANDING' | 'INVOICE' = 'BILLS';

  bills: any[] = [];
  payments: any[] = [];

  selectedBill: any = null;
  outstanding: any = null;

  selectedInvoice: any = null;

  private baseUrl = 'http://localhost:8031';

  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
ngOnInit() {
  this.loadData(); // ✅ loads ALL bills by default
}
  loadData() {
  this.loading = true;
  this.error = '';
  this.activeTab = 'BILLS';
this.selectedBill = null;
this.selectedInvoice = null;
this.outstanding = null;

  // ------------------ BILLS ------------------
  const billsUrl = this.consumerId
    ? `${this.baseUrl}/bills/consumer/${this.consumerId}`
    : `${this.baseUrl}/bills`;

  this.http.get<any[]>(billsUrl).subscribe({
    next: res => {
      this.bills = res;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.error = 'No bills found';
      this.loading = false;
    }
  });

  // ------------------ PAYMENTS ------------------
  const paymentsUrl = this.consumerId
    ? `${this.baseUrl}/payments/consumer/${this.consumerId}`
    : `${this.baseUrl}/payments`;

  this.http.get<any[]>(paymentsUrl).subscribe({
    next: res => {
      this.payments = res;
      this.cdr.detectChanges();
    },
    error: () => {
      this.payments = [];
    }
  });
}

  viewBill(bill: any) {
    this.selectedBill = bill;
    this.activeTab = 'OUTSTANDING';

    this.http.get<any>(`${this.baseUrl}/payments/outstanding/${bill.id}`)
      .subscribe(res => {
        this.outstanding = res;
        this.cdr.detectChanges();
      });
  }

  viewInvoice(payment: any) {
  this.loading = true;
  this.error = '';

  this.http
    .get<any>(`${this.baseUrl}/payments/invoice/${payment.paymentId}`)
    .subscribe({
      next: (invoice) => {
        this.selectedInvoice = invoice;   // ✅ real invoice
        this.activeTab = 'INVOICE';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = 'Invoice not found for this payment';
      }
    });
}

  downloadInvoice(paymentId: string) {
    this.http.get(
      `${this.baseUrl}/payments/invoice/${paymentId}/download`,
      { responseType: 'blob' }
    ).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}