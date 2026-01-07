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

  pieType: ChartType = 'pie';
  paymentPieData: ChartData<'pie', number[], string> = {
    labels: ['Paid', 'Outstanding'],
    datasets: [{ data: [] }]
  };

  barType: ChartType = 'bar';
  revenueBarData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ label: 'Revenue', data: [] }]
  };

  stackedBarType: ChartType = 'bar';

outstandingStackedBarData: ChartData<'bar', number[], string> = {
  labels: [],
  datasets: [
    { label: 'Total Billed', data: [] },
    { label: 'Total Paid', data: [] },
    { label: 'Outstanding', data: [] }
  ]
};

stackedBarOptions = {
  responsive: true,
  scales: {
    x: { stacked: true },
    y: { stacked: true }
  }
};
yearlyRevenueLineData: ChartData<'line', number[], string> = {
  labels: [],
  datasets: [
    {
      label: 'Revenue',
      data: [],
      fill: false,
      tension: 0.3
    }
  ]
};

yearlyRevenueLineType: ChartType = 'line';
paymentModeDonutData: ChartData<'doughnut', number[], string> = {
  labels: [],
  datasets: [
    {
      data: []
    }
  ]
};

paymentModeDonutType: ChartType = 'doughnut';

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
    this.loadYearlyRevenue();
  this.loadRevenueByMode();
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

    this.paymentPieData = {
      labels: ['Successful', 'Failed'],
      datasets: [{
        data: [
          res.successfulPayments,
          res.failedPayments
        ]
      }]
    };

    this.cdr.detectChanges();
  });
}
loadYearlyRevenue() {
  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  this.http.get<any[]>(
    `${this.baseUrl}/dashboard/payments/revenue-yearly?year=${this.year}`
  ).subscribe(res => {

    this.yearlyRevenueLineData = {
      labels: res.map(r => monthNames[r.month - 1]),
      datasets: [
        {
          label: 'Revenue',
          data: res.map(r => r.totalRevenue),
          fill: false,
          tension: 0.3
        }
      ]
    };

    this.cdr.detectChanges();
  });
}

  loadOutstandingTrend() {
  this.http.get<any[]>(
    `${this.baseUrl}/dashboard/payments/outstanding-monthly?year=${this.year}`
  ).subscribe(res => {

    this.outstandingStackedBarData = {
      labels: res.map(r => r.monthName),
      datasets: [
        {
          label: 'Total Billed',
          data: res.map(r => r.totalBilled)
        },
        {
          label: 'Total Paid',
          data: res.map(r => r.totalPaid)
        },
        {
          label: 'Outstanding',
          data: res.map(r => r.outstandingAmount)
        }
      ]
    };

    this.cdr.detectChanges();
  });
}
loadRevenueByMode() {
  this.http.get<any[]>(
    `${this.baseUrl}/dashboard/payments/revenue-by-mode?month=${this.month}&year=${this.year}`
  ).subscribe(res => {

    this.paymentModeDonutData = {
      labels: res.map(r => r.mode),
      datasets: [
        {
          data: res.map(r => r.amount)
        }
      ]
    };

    this.cdr.detectChanges();
  });
}
  onFilterChange() {
    this.loadDashboard();
  }
}