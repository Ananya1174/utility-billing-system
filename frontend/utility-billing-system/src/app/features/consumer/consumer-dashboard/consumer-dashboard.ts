import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConsumerService } from '../../../services/consumer';
import { BillService } from '../../../services/bill';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective,FormsModule],
  templateUrl: './consumer-dashboard.html',
  styleUrls: ['./consumer-dashboard.css']
})
export class ConsumerDashboard implements OnInit {

  loading = true;
  summary: any = null;

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

  /* ================= PIE ================= */
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#2563eb',
        '#16a34a',
        '#dc2626',
        '#f59e0b',
        '#7c3aed',
        '#0ea5e9'
      ]
    }]
  };

  /* ================= BAR ================= */
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{
      label: 'Units',
      data: [],
      backgroundColor: '#2563eb'
    }]
  };

  /* ================= DOUGHNUT ================= */
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartData: ChartData<'doughnut', number[], string> = {
    labels: ['Paid Bills', 'Unpaid Bills'],
    datasets: [{
      data: [],
      backgroundColor: ['#16a34a', '#dc2626']
    }]
  };

  /* ================= AMOUNT ================= */
  amountBarChartType: ChartType = 'bar';
  amountBarChartData: ChartData<'bar', number[], string> = {
    labels: ['Paid', 'Outstanding'],
    datasets: [{
      label: 'Amount (₹)',
      data: [],
      backgroundColor: ['#16a34a', '#dc2626']
    }]
  };

  constructor(
    private readonly consumerService: ConsumerService,
    private readonly billService: BillService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  onFilterChange(): void {
    this.loadCharts();
  }

  loadSummary(): void {
    this.consumerService.getDashboardSummary().subscribe({
      next: res => {
        this.summary = res;
        this.loading = false;
        this.loadCharts();
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCharts(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.billService.getConsumerBills(userId).subscribe(bills => {

      /* PIE */
      const utilityMap: Record<string, number> = {};
      bills.forEach(b =>
        utilityMap[b.utilityType] =
          (utilityMap[b.utilityType] || 0) + (b.consumptionUnits || 0)
      );

      this.pieChartData.labels = Object.keys(utilityMap);
      this.pieChartData.datasets[0].data = Object.values(utilityMap);

      /* MONTHLY */
      const monthMap: Record<string, number> = {};
      bills.forEach(b => {
        if (b.billingMonth === this.month && b.billingYear === this.year) {
          const key = `${b.billingMonth}/${b.billingYear}`;
          monthMap[key] = (monthMap[key] || 0) + (b.consumptionUnits || 0);
        }
      });

      this.barChartData.labels = Object.keys(monthMap);
      this.barChartData.datasets[0].data = Object.values(monthMap);

      /* PAID vs UNPAID */
      const paid = bills.filter(b => b.status === 'PAID').length;
      const unpaid = bills.filter(b => b.status !== 'PAID').length;
      this.doughnutChartData.datasets[0].data = [paid, unpaid];

      /* AMOUNT */
      this.amountBarChartData.datasets[0].data = [
        this.summary.lastPaymentAmount || 0,
        this.summary.totalOutstanding || 0
      ];

      this.cdr.detectChanges();
    });
  }

  goToBills() {
    this.router.navigate(['/consumer/bills']);
  }

  goToUtilities() {
    this.router.navigate(['/consumer/utilities']);
  }

  payDueBill() {
    this.router.navigate(['/consumer/bills']);
  }
}