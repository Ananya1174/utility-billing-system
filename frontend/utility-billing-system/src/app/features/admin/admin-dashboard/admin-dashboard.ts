import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';

import { AdminDashboardService } from '../../../services/admin-dashboard';
import { Navbar } from "../../../shared/navbar/navbar";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, Navbar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  selectedMonthName = '';

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

  monthlyOutstandingAmount = 0;

  consumptionData: any[] = [];
  revenueByMode: any[] = [];
  monthlyOutstanding: any[] = [];

  consumptionChartData: any;
  revenueChartData: any;
  outstandingChartData: any;

  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDashboard();
    this.updateSelectedMonthName();
  }

  onFilterChange() {
    this.loadDashboard();
    this.updateSelectedMonthName();
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
    this.dashboardService.getMonthlyOutstanding(this.year)
  .subscribe(res => {

    this.monthlyOutstanding = (res || []).map(m => ({
      ...m,
      outstandingAmount: Number(
        (
          m.outstandingAmount ??
          ((m.totalBilled ?? 0) - (m.totalPaid ?? 0))
        ).toFixed(2)
      )
    }));

    const currentMonth = this.monthlyOutstanding.find(
      m => Number(m.month) === Number(this.month)
    );

    this.monthlyOutstandingAmount =
      currentMonth?.outstandingAmount ?? 0;

    this.buildOutstandingChart();
    this.cdr.detectChanges();
  });
}

  buildConsumptionChart() {
    this.consumptionChartData = {
      labels: this.consumptionData.map(c => c.utilityType),
      datasets: [{ data: this.consumptionData.map(c => c.totalUnits) }]
    };
  }
  updateSelectedMonthName() {
    const found = this.months.find(m => m.value === this.month);
    this.selectedMonthName = found ? found.name : '';
  }

  buildRevenueChart() {
    this.revenueChartData = {
      labels: this.revenueByMode.map(r => r.mode),
      datasets: [{ data: this.revenueByMode.map(r => r.amount) }]
    };
  }

  buildOutstandingChart() {
    this.outstandingChartData = {
      labels: this.monthlyOutstanding.map(m => m.monthName),
      datasets: [{
        data: this.monthlyOutstanding.map(m => m.outstandingAmount),
        label: 'Outstanding Amount'
      }]
    };
  }
}