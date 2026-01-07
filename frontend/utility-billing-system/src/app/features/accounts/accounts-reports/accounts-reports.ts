import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accounts-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts-reports.html',
  styleUrls: ['./accounts-reports.css']
})
export class AccountsReportsComponent implements OnInit {

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  paymentModeSummary: any[] = [];
  yearlyRevenue: any[] = [];
  consumerSummary: any[] = [];
  paymentStatusSummary: any = null;

  baseUrl = 'http://localhost:8031';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loadPaymentMode();
    this.loadYearlyRevenue();
    this.loadConsumerSummary();
    this.loadPaymentStatusSummary();
  }

  onFilterChange(): void {
    this.loadReports();
  }

  loadPaymentMode(): void {
    this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/revenue-by-mode?month=${this.month}&year=${this.year}`
    ).subscribe(res => {
      this.paymentModeSummary = res;
      this.cdr.detectChanges();
    });
  }

  loadYearlyRevenue(): void {
    this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/revenue-yearly?year=${this.year}`
    ).subscribe(res => {
      this.yearlyRevenue = res;
      this.cdr.detectChanges();
    });
  }

  loadConsumerSummary(): void {
    this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/consumer-summary?month=${this.month}&year=${this.year}`
    ).subscribe(res => {
      this.consumerSummary = res;
      this.cdr.detectChanges();
    });
  }

  loadPaymentStatusSummary(): void {
    this.http.get<any>(
      `${this.baseUrl}/dashboard/payments/payments-summary?month=${this.month}&year=${this.year}`
    ).subscribe(res => {
      this.paymentStatusSummary = res;
      this.cdr.detectChanges();
    });
  }
}