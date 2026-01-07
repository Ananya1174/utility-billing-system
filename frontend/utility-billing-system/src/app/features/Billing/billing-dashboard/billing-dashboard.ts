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
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './billing-dashboard.html',
  styleUrls: ['./billing-dashboard.css']
})
export class BillingOfficerDashboardComponent implements OnInit {

  loading = true;


  summary: any = null;
  outstandingSummary: any = null;

  unpaidCount = 0;
  overdueCount = 0;


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


  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  months = [1,2,3,4,5,6,7,8,9,10,11,12];
  years = [2023, 2024, 2025, 2026];

  monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  get selectedMonthName(): string {
    return this.monthNames[this.month - 1];
  }

  private baseUrl = 'http://localhost:8031';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }


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


  loadOutstandingSummary(): void {
    this.http
      .get<any>(`${this.baseUrl}/dashboard/payments/outstanding-summary`)
      .subscribe(res => {
        this.outstandingSummary = res;
        this.cdr.detectChanges();
      });
  }


  loadConsumptionSummary(): void {
    this.http
      .get<any[]>(
        `${this.baseUrl}/dashboard/billing/consumption-summary?month=${this.month}&year=${this.year}`
      )
      .subscribe(res => {

        const utilityOrder = ['ELECTRICITY', 'WATER', 'GAS', 'INTERNET'];

        const labels: string[] = [];
        const values: number[] = [];

        utilityOrder.forEach(type => {
          const match = res.find(r => r.utilityType === type);
          if (match) {
            labels.push(match.utilityType);
            values.push(match.totalUnits);
          }
        });

        this.barChartData = {
          labels,
          datasets: [
            {
              label: 'Consumption Units',
              data: values
            }
          ]
        };

        this.cdr.detectChanges();
      });
  }


  loadAlerts(): void {
    this.http.get<any[]>(`${this.baseUrl}/bills?status=DUE`)
      .subscribe(res => this.unpaidCount = res.length);

    this.http.get<any[]>(`${this.baseUrl}/bills?status=OVERDUE`)
      .subscribe(res => this.overdueCount = res.length);
  }
  goToMeterReadings() { this.router.navigate(['/billing/meter-readings']); }
  goToGenerateBills() { this.router.navigate(['billing/generate-bills']); }
  goToViewBills() { this.router.navigate(['/billing/logs']); }
}