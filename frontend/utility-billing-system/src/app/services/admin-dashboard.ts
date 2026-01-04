import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {

  private baseUrl = 'http://localhost:8031';

  constructor(private http: HttpClient) {}

  getBillsSummary(month: number, year: number) {
    return this.http.get<any>(
      `${this.baseUrl}/dashboard/billing/bills-summary?month=${month}&year=${year}`
    );
  }

  getConsumptionSummary(month: number, year: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/dashboard/billing/consumption-summary?month=${month}&year=${year}`
    );
  }

  getRevenueSummary(month: number, year: number) {
    return this.http.get<any>(
      `${this.baseUrl}/dashboard/payments/revenue-summary?month=${month}&year=${year}`
    );
  }

  getOutstandingSummary() {
    return this.http.get<any>(
      `${this.baseUrl}/dashboard/payments/outstanding-summary`
    );
  }

  getRevenueByMode(month: number, year: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/revenue-by-mode?month=${month}&year=${year}`
    );
  }

  getPendingUtilityRequests() {
    return this.http.get<any[]>(
      `${this.baseUrl}/connections/requests/pending`
    );
  }
}