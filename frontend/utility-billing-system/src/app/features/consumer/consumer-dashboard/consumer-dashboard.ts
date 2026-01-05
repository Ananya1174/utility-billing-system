import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConsumerService } from '../../../services/consumer';
import { BillService } from '../../../services/bill';
import { AuthService } from '../../../services/auth';

import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './consumer-dashboard.html',
  styleUrls: ['./consumer-dashboard.css']
})
export class ConsumerDashboard implements OnInit {

  loading = true;
  summary: any = null;

  /* ================= PIE CHART ================= */
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  /* ================= MONTHLY BAR ================= */
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ label: 'Units', data: [] }]
  };

  /* ================= PAID vs UNPAID ================= */
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartData: ChartData<'doughnut', number[], string> = {
    labels: ['Paid Bills', 'Unpaid Bills'],
    datasets: [{ data: [] }]
  };

  /* ================= AMOUNT COMPARISON ================= */
  amountBarChartType: ChartType = 'bar';
  amountBarChartData: ChartData<'bar', number[], string> = {
    labels: ['Paid', 'Outstanding'],
    datasets: [{ label: 'Amount (₹)', data: [] }]
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

  loadSummary(): void {
    this.consumerService.getDashboardSummary().subscribe({
      next: res => {
        this.summary = res;
        this.loading = false;
        this.loadCharts();   // 🔑 call after summary
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

      /* ---------- PIE ---------- */
      const utilityMap: Record<string, number> = {};
      bills.forEach(b =>
        utilityMap[b.utilityType] =
          (utilityMap[b.utilityType] || 0) + (b.consumptionUnits || 0)
      );

      this.pieChartData.labels = Object.keys(utilityMap);
      this.pieChartData.datasets[0].data = Object.values(utilityMap);

      /* ---------- MONTHLY ---------- */
      const monthMap: Record<string, number> = {};
      bills.forEach(b => {
        const key = `${b.billingMonth}/${b.billingYear}`;
        monthMap[key] = (monthMap[key] || 0) + (b.consumptionUnits || 0);
      });

      const sorted = Object.keys(monthMap).sort();
      this.barChartData.labels = sorted;
      this.barChartData.datasets[0].data = sorted.map(k => monthMap[k]);

      /* ---------- PAID vs UNPAID ---------- */
      const paid = bills.filter(b => b.status === 'PAID').length;
      const unpaid = bills.filter(b => b.status !== 'PAID').length;
      this.doughnutChartData.datasets[0].data = [paid, unpaid];

      /* ---------- AMOUNT ---------- */
      this.amountBarChartData.datasets[0].data = [
        this.summary.lastPaymentAmount || 0,
        this.summary.totalOutstanding || 0
      ];

      this.cdr.detectChanges();
    });
  }

  goToBills(): void {
    this.router.navigate(['/consumer/bills']);
  }

  goToUtilities(): void {
    this.router.navigate(['/consumer/utilities']);
  }

  payDueBill(): void {
    this.router.navigate(['/consumer/bills']);
  }
}