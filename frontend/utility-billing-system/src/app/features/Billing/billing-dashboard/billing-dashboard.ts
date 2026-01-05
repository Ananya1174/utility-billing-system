import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-billing-officer-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective,FormsModule],
  templateUrl: './billing-dashboard.html',
  styleUrls: ['./billing-dashboard.css']
})
export class BillingOfficerDashboardComponent implements OnInit {

  loading = true;

  /* ================= KPI DATA ================= */

  summary: any = null;
  outstandingSummary: any = null;

  unpaidCount = 0;
  overdueCount = 0;

  /* ================= CHART ================= */

  barChartType: ChartType = 'bar';

  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        label: 'Consumption Units',
        data: []
      }
    ]
  };

  /* ================= DATE FILTER ================= */

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  months = [1,2,3,4,5,6,7,8,9,10,11,12];
  years = [2023, 2024, 2025, 2026];

  private baseUrl = 'http://localhost:8031';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  /* ================= LOAD DASHBOARD ================= */

  loadDashboard(): void {
    this.loading = true;

    this.loadBillSummary();
    this.loadOutstandingSummary();
    this.loadConsumptionSummary();
    this.loadAlerts();
  }

  onDateChange(): void {
    this.loadConsumptionSummary();
    this.loadBillSummary();
  }

  /* ================= KPI SUMMARY ================= */

  loadBillSummary(): void {
    this.http
      .get<any>(
        `${this.baseUrl}/dashboard/billing/bills-summary?month=${this.month}&year=${this.year}`
      )
      .subscribe({
        next: res => {
          this.summary = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  /* ================= TOTAL BILLED ================= */

  loadOutstandingSummary(): void {
    this.http
      .get<any>(`${this.baseUrl}/dashboard/payments/outstanding-summary`)
      .subscribe(res => {
        this.outstandingSummary = res;
        this.cdr.detectChanges();
      });
  }

  /* ================= CONSUMPTION CHART ================= */

  loadConsumptionSummary(): void {
    this.http
      .get<any[]>(
        `${this.baseUrl}/dashboard/billing/consumption-summary?month=${this.month}&year=${this.year}`
      )
      .subscribe(res => {

        const labels: string[] = [];
        const values: number[] = [];

        res.forEach(r => {
          labels.push(r.utilityType);
          values.push(r.totalUnits);
        });

        this.barChartData.labels = labels;
        this.barChartData.datasets[0].data = values;

        this.cdr.detectChanges();
      });
  }

  /* ================= ALERT COUNTS ================= */

  loadAlerts(): void {
    this.http.get<any[]>(`${this.baseUrl}/bills?status=DUE`)
      .subscribe(res => this.unpaidCount = res.length);

    this.http.get<any[]>(`${this.baseUrl}/bills?status=OVERDUE`)
      .subscribe(res => this.overdueCount = res.length);
  }

  /* ================= NAVIGATION ================= */

  goToBillingLogs(): void {
    this.router.navigate(['/billing-officer/billing-logs']);
  }

  goToMeterReadings(): void {
    this.router.navigate(['/billing-officer/meter-readings']);
  }

  goToGenerateBill(): void {
    this.router.navigate(['/billing-officer/generate-bill']);
  }
}