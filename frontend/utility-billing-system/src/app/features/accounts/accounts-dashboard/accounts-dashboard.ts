import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-accounts-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective,FormsModule],
  templateUrl: './accounts-dashboard.html',
  styleUrls: ['./accounts-dashboard.css']
})
export class AccountsDashboardComponent implements OnInit {

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  totalBilled = 0;
  totalPaid = 0;
  outstanding = 0;
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

  /* ================= PIE ================= */
  pieType: ChartType = 'pie';
  paymentPieData: ChartData<'pie', number[], string> = {
    labels: ['Paid', 'Outstanding'],
    datasets: [{ data: [] }]
  };

  /* ================= BAR ================= */
  barType: ChartType = 'bar';
  revenueBarData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ label: 'Revenue', data: [] }]
  };

  /* ================= LINE ================= */
  lineType: ChartType = 'line';
  outstandingLineData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [{ label: 'Outstanding', data: [] }]
  };

  baseUrl = 'http://localhost:8031';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loadOutstanding();
    this.loadPaymentStatus();
    this.loadOutstandingTrend();
  }

  loadOutstanding() {
    this.http.get<any>(`${this.baseUrl}/dashboard/payments/outstanding-summary`)
      .subscribe(res => {
        this.totalBilled = res.totalBilled;
        this.totalPaid = res.totalPaid;
        this.outstanding = res.outstandingAmount;
        this.cdr.detectChanges();
      });
  }

  loadPaymentStatus() {
    this.http.get<any>(
      `${this.baseUrl}/dashboard/payments/payments-summary?month=${this.month}&year=${this.year}`
    ).subscribe(res => {
      this.paymentPieData.datasets[0].data = [
        res.success,
        res.failed
      ];
      this.cdr.detectChanges();
    });
  }

  loadOutstandingTrend() {
    this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/outstanding-monthly?year=${this.year}`
    ).subscribe(res => {
      this.outstandingLineData.labels = res.map(r => r.monthName);
      this.outstandingLineData.datasets[0].data =
        res.map(r => r.outstanding);
      this.cdr.detectChanges();
    });
  }

  onFilterChange() {
    this.loadDashboard();
  }
}