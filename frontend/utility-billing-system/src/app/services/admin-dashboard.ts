import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {

  private baseUrl = 'http://localhost:8031';

  constructor(private http: HttpClient) {}

  /* ================= BILLING ================= */

  getBillsSummary(month: number, year: number) {
    return this.http.get<any>(
      `${this.baseUrl}/dashboard/billing/bills-summary?month=${month}&year=${year}`
    );
  }

  getConsumerBillingSummary(month: number, year: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/dashboard/billing/consumer-summary?month=${month}&year=${year}`
    );
  }

  getConsumptionSummary(month: number, year: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/dashboard/billing/consumption-summary?month=${month}&year=${year}`
    );
  }

  getAverageConsumption(month: number, year: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/dashboard/billing/consumption-average?month=${month}&year=${year}`
    );
  }

  /* ================= PAYMENTS ================= */

  getRevenueSummary(month: number, year: number) {
    return this.http.get<any>(
      `${this.baseUrl}/dashboard/payments/revenue-summary?month=${month}&year=${year}`
    );
  }

  getRevenueByMode(month: number, year: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/revenue-by-mode?month=${month}&year=${year}`
    );
  }

  getOutstandingSummary() {
    return this.http.get<any>(
      `${this.baseUrl}/dashboard/payments/outstanding-summary`
    );
  }

  getTopPayingConsumers(month: number, year: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/consumer-summary?month=${month}&year=${year}`
    );
  }

  /* ================= TRENDS ================= */

  getMonthlyOutstanding(year: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/dashboard/payments/outstanding-monthly?year=${year}`
    );
  }
}