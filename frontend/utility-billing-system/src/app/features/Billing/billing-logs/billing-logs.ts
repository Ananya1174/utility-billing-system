import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-billing-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing-logs.html',
  styleUrls: ['./billing-logs.css']
})
export class BillingLogsComponent implements OnInit {

  bills: any[] = [];
  loading = false;
  error = '';

  /* ================= FILTERS ================= */

  status: '' | 'DUE' | 'PAID' | 'OVERDUE' = '';
  month: number | null = null;
  year: number | null = null;
  consumerId = '';

  months = [1,2,3,4,5,6,7,8,9,10,11,12];
  years = [2023, 2024, 2025, 2026];

  private baseUrl = 'http://localhost:8031';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBills();
  }

  /* ================= LOAD BILLS ================= */

  loadBills(): void {
    this.loading = true;
    this.error = '';

    const params: any = {};

    if (this.status) params.status = this.status;
    if (this.month) params.month = this.month;
    if (this.year) params.year = this.year;
    if (this.consumerId.trim()) params.consumerId = this.consumerId.trim();

    this.http.get<any[]>(`${this.baseUrl}/bills`, { params })
      .subscribe({
        next: res => {
          this.bills = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Failed to load billing logs';
          this.loading = false;
        }
      });
  }

  clearFilters(): void {
    this.status = '';
    this.month = null;
    this.year = null;
    this.consumerId = '';
    this.loadBills();
  }

  /* ================= HELPERS ================= */

  statusClass(status: string): string {
    if (status === 'PAID') return 'paid';
    if (status === 'OVERDUE') return 'overdue';
    return 'due';
  }
}