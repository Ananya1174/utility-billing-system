import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

import { AdminDashboardService } from '../../../services/admin-dashboard';
import { Navbar } from "../../../shared/navbar/navbar";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  BaseChartDirective,
  Navbar
],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  months = [
    { value: 1, name: 'Jan' }, { value: 2, name: 'Feb' },
    { value: 3, name: 'Mar' }, { value: 4, name: 'Apr' },
    { value: 5, name: 'May' }, { value: 6, name: 'Jun' },
    { value: 7, name: 'Jul' }, { value: 8, name: 'Aug' },
    { value: 9, name: 'Sep' }, { value: 10, name: 'Oct' },
    { value: 11, name: 'Nov' }, { value: 12, name: 'Dec' }
  ];

  years = [2024, 2025, 2026];

  billsSummary: any;
  revenueSummary: any;
  outstandingSummary: any;
  pendingRequestsCount = 0;

  consumptionData: any[] = [];
  revenueByMode: any[] = [];

  // CHART DATA
  consumptionChartData: any;
  revenueChartData: any;

  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  onFilterChange() {
    this.loadDashboard();
  }

  loadDashboard() {

    this.dashboardService.getBillsSummary(this.month, this.year)
      .subscribe(res => {
        this.billsSummary = res;
        this.cdr.detectChanges();
      });

    this.dashboardService.getRevenueSummary(this.month, this.year)
      .subscribe(res => {
        this.revenueSummary = res;
        this.cdr.detectChanges();
      });

    this.dashboardService.getOutstandingSummary()
      .subscribe(res => {
        this.outstandingSummary = res;
        this.cdr.detectChanges();
      });

    this.dashboardService.getPendingUtilityRequests()
      .subscribe(res => this.pendingRequestsCount = res.length);

    this.dashboardService.getConsumptionSummary(this.month, this.year)
      .subscribe(res => {
        this.consumptionData = res || [];
        this.buildConsumptionChart();
      });

    this.dashboardService.getRevenueByMode(this.month, this.year)
      .subscribe(res => {
        this.revenueByMode = res || [];
        this.buildRevenueChart();
      });
  }

  buildConsumptionChart() {
    this.consumptionChartData = {
      labels: this.consumptionData.map(c => c.utilityType),
      datasets: [{
        data: this.consumptionData.map(c => c.totalUnits),
        label: 'Units Consumed'
      }]
    };
  }

  buildRevenueChart() {
    this.revenueChartData = {
      labels: this.revenueByMode.map(r => r.mode),
      datasets: [{
        data: this.revenueByMode.map(r => r.amount),
        label: 'Revenue'
      }]
    };
  }
}