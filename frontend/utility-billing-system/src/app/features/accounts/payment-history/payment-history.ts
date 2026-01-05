import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-history.html',
  styleUrls: ['./payment-history.css']
})
export class PaymentHistoryComponent implements OnInit {

  payments: any[] = [];
  filteredPayments: any[] = [];

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  selectedStatus = 'ALL';
  selectedMode = 'ALL';

  summary: any = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPayments();
    this.loadSummary();
  }

  loadPayments(): void {
    this.http.get<any[]>('http://localhost:8031/payments')
      .subscribe(res => {
        this.payments = res;
        this.applyFilters();
        this.loading = false;
      });
  }

  loadSummary(): void {
    this.http.get<any>(
      `http://localhost:8031/dashboard/payments/payments-summary?month=${this.selectedMonth}&year=${this.selectedYear}`
    ).subscribe(res => this.summary = res);
  }

  applyFilters(): void {
    this.filteredPayments = this.payments.filter(p => {
      const matchStatus =
        this.selectedStatus === 'ALL' || p.status === this.selectedStatus;

      const matchMode =
        this.selectedMode === 'ALL' || p.mode === this.selectedMode;

      return matchStatus && matchMode;
    });
  }

  getStatusClass(status: string): string {
    if (status === 'SUCCESS') return 'status success';
    if (status === 'FAILED') return 'status failed';
    return 'status initiated';
  }
}