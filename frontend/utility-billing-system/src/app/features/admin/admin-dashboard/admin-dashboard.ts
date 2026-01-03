import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../../services/admin-dashboard';
import { Navbar } from "../../../shared/navbar/navbar";
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  billsSummary: any;
  revenueSummary: any;
  outstandingSummary: any;
  pendingRequestsCount = 0;

  consumptionData: any[] = [];
  revenueByMode: any[] = [];

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getBillsSummary(this.month, this.year)
      .subscribe(res => this.billsSummary = res);

    this.dashboardService.getRevenueSummary(this.month, this.year)
      .subscribe(res => this.revenueSummary = res);

    this.dashboardService.getOutstandingSummary()
      .subscribe(res => this.outstandingSummary = res);

    this.dashboardService.getPendingUtilityRequests()
      .subscribe(res => this.pendingRequestsCount = res.length);

    this.dashboardService.getConsumptionSummary(this.month, this.year)
      .subscribe(res => this.consumptionData = res);

    this.dashboardService.getRevenueByMode(this.month, this.year)
      .subscribe(res => this.revenueByMode = res);
  }
}