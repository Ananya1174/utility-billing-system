import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminDashboardService } from '../../../services/admin-dashboard';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReportsComponent implements OnInit {

  month!: number;
  year!: number;

  months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];

  years = [2024, 2025, 2026];

  consumerBilling: any[] = [];
  avgConsumption: any[] = [];
  topConsumers: any[] = [];
  collectionGap: any;
  monthlyOutstanding: any[] = [];

  loading = false;

  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const now = new Date();
    this.month = now.getMonth() + 1;
    this.year = now.getFullYear();
    this.loadReports();
  }

  loadReports() {
    this.loading = true;

    this.dashboardService.getConsumerBillingSummary(this.month, this.year)
      .subscribe(res => {
        this.consumerBilling = res;
        this.cdr.detectChanges();
      });

    this.dashboardService.getAverageConsumption(this.month, this.year)
      .subscribe(res => {
        this.avgConsumption = res;
        this.cdr.detectChanges();
      });

    this.dashboardService.getTopPayingConsumers(this.month, this.year)
      .subscribe(res => {
        this.topConsumers = res;
        this.cdr.detectChanges();
      });

    this.dashboardService.getOutstandingSummary()
      .subscribe(res => {
        this.collectionGap = res;
        this.cdr.detectChanges();
      });

    this.dashboardService.getMonthlyOutstanding(this.year)
      .subscribe(res => {
        this.monthlyOutstanding = res;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}