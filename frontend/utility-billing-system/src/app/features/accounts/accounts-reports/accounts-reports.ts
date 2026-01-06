import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accounts-reports',
  standalone: true,
  imports: [CommonModule, BaseChartDirective,FormsModule],
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

  paymentModePie: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  yearlyRevenueBar: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ label: 'Revenue', data: [] }]
  };

  consumerSummary: any[] = [];

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
  }

  onFilterChange(): void {
    this.loadReports();
  }

  loadPaymentMode(): void {
    this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/revenue-by-mode?month=${this.month}&year=${this.year}`
    ).subscribe(res => {
      this.paymentModePie.labels = res.map(r => r.mode);
      this.paymentModePie.datasets[0].data = res.map(r => r.amount);
      this.cdr.detectChanges();
    });
  }

  monthlyRevenueLine: ChartData<'line', number[], string> = {
  labels: [],
  datasets: [
    {
      label: 'Revenue',
      data: []
    }
  ]
};
loadYearlyRevenue(): void {
  this.http.get<any[]>(
    `${this.baseUrl}/dashboard/payments/revenue-yearly?year=${this.year}`
  ).subscribe(res => {

    this.monthlyRevenueLine.labels =
      res.map(r => `Month ${r.month}`);

    this.monthlyRevenueLine.datasets[0].data =
      res.map(r => r.revenue);

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
}