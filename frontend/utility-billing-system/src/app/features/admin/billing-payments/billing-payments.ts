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
  activeTab = 'BILLS';

  bills: any[] = [];
  payments: any[] = [];

  selectedBill: any = null;
  outstanding: any = null;

  selectedPayment: any = null;
  invoice: any = null;

  private baseUrl = 'http://localhost:8031';
  private invoiceBaseUrl = 'http://localhost:8035';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  loadData() {
    if (!this.consumerId) return;

    this.http.get<any[]>(`${this.baseUrl}/bills/consumer/${this.consumerId}`)
      .subscribe(res => {
        this.bills = res;
        this.cdr.detectChanges();
      });

    this.http.get<any[]>(`${this.baseUrl}/payments/consumer/${this.consumerId}`)
      .subscribe(res => {
        this.payments = res;
        this.cdr.detectChanges();
      });
  }

  viewBill(billId: string) {
    this.http.get<any>(`${this.baseUrl}/bills/${billId}`)
      .subscribe(res => {
        this.selectedBill = res;
        this.activeTab = 'OUTSTANDING';
        this.loadOutstanding(billId);
      });
  }

  loadOutstanding(billId: string) {
    this.http.get<any>(`${this.baseUrl}/payments/outstanding/${billId}`)
      .subscribe(res => {
        this.outstanding = res;
        this.cdr.detectChanges();
      });
  }

  viewInvoice(paymentId: string) {
    this.http.get<any>(`${this.baseUrl}/payments/invoice/${paymentId}`)
      .subscribe(res => {
        this.invoice = res;
        this.activeTab = 'INVOICE';
        this.cdr.detectChanges();
      });
  }

  downloadInvoice(paymentId: string) {

  this.http.get(
    `${this.baseUrl}/payments/invoice/${paymentId}/download`,
    {
      responseType: 'blob',  
      observe: 'response'
    }
  ).subscribe({
    next: (res) => {
      const blob = res.body!;
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentId}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: err => {
      console.error('Download failed', err);
      alert('Invoice download failed (Unauthorized or Forbidden)');
    }
  });
}
}