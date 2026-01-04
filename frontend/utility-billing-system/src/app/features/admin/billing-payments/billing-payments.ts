

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

  pagedBills: any[] = [];
  pagedPayments: any[] = [];

  selectedBill: any = null;
  selectedInvoice: any = null;
  outstanding: any = null;

  pageIndex = 0;
  pageSize = 10;
  totalPages = 0;

  sortState: any = { bills: {}, payments: {} };

  loading = false;
  error = '';

  private baseUrl = 'http://localhost:8031';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  switchTab(tab: any) {
    this.activeTab = tab;
    this.pageIndex = 0;
    this.updatePaging();
  }

  loadData() {
    this.loading = true;
    this.error = '';

    const billsUrl = this.consumerId
      ? `${this.baseUrl}/bills/consumer/${this.consumerId}`
      : `${this.baseUrl}/bills`;

    this.http.get<any[]>(billsUrl).subscribe(res => {
      this.bills = res || [];
      this.updatePaging();
      this.loading = false;
    });

    const paymentsUrl = this.consumerId
      ? `${this.baseUrl}/payments/consumer/${this.consumerId}`
      : `${this.baseUrl}/payments`;

    this.http.get<any[]>(paymentsUrl).subscribe({
      next: res => {
        this.payments = res || [];
        this.updatePaging();
      },
      error: () => this.payments = []   // 403 safe fallback
    });
  }

  updatePaging() {
    const data = this.activeTab === 'PAYMENTS' ? this.payments : this.bills;
    this.totalPages = Math.max(1, Math.ceil(data.length / this.pageSize));
    this.sliceData();
  }

  sliceData() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedBills = this.bills.slice(start, end);
    this.pagedPayments = this.payments.slice(start, end);
  }

  changePageSize() {
    this.pageIndex = 0;
    this.updatePaging();
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.sliceData();
    }
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.sliceData();
    }
  }

  sort(type: 'bills' | 'payments', key: string) {
    const dir = this.sortState[type][key] === 'asc' ? 'desc' : 'asc';
    this.sortState[type] = { [key]: dir };

    const arr = type === 'bills' ? this.bills : this.payments;

    arr.sort((a, b) => {
      if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePaging();
  }

  sortIcon(type: string, key: string) {
    const dir = this.sortState[type][key];
    return dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : '';
  }

  viewBill(bill: any) {
    this.selectedBill = bill;
    this.activeTab = 'OUTSTANDING';
  }

  viewInvoice(payment: any) {
    this.http.get<any>(`${this.baseUrl}/payments/invoice/${payment.paymentId}`)
      .subscribe(res => {
        this.selectedInvoice = res;
        this.activeTab = 'INVOICE';
      });
  }

  downloadInvoice(paymentId: string) {
    this.http.get(
      `${this.baseUrl}/payments/invoice/${paymentId}/download`,
      { responseType: 'blob' }
    ).subscribe(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `invoice-${paymentId}.pdf`;
      a.click();
    });
  }
}