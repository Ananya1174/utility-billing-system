

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
  pagedBills: any[] = [];

  loading = false;
  error = '';


  status: '' | 'DUE' | 'PAID' | 'OVERDUE' = '';
  month: number | null = null;
  year: number | null = null;
  consumerId = '';

  months = [1,2,3,4,5,6,7,8,9,10,11,12];
  years = [2023, 2024, 2025, 2026];


  pageSizeOptions = [10, 25, 50];
  pageSize = 10;
  pageIndex = 0;
  totalPages = 0;

  private baseUrl = 'http://localhost:8031';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;
    this.error = '';

    const params: any = {};
    if (this.status) params.status = this.status;
    if (this.month) params.month = this.month;
    if (this.year) params.year = this.year;
    if (this.consumerId.trim()) params.consumerId = this.consumerId.trim();

    this.http.get<any[]>(`${this.baseUrl}/bills`, { params }).subscribe({
      next: res => {
        this.bills = res || [];
        this.pageIndex = 0;
        this.applyPaging();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load billing logs';
        this.loading = false;
        this.cdr.detectChanges();
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

  applyPaging(): void {
    this.totalPages = Math.ceil(this.bills.length / this.pageSize);

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;

    this.pagedBills = this.bills.slice(start, end);
  }

  changePageSize(): void {
    this.pageIndex = 0;
    this.applyPaging();
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.applyPaging();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.applyPaging();
    }
  }

  goToPage(index: number): void {
    this.pageIndex = index;
    this.applyPaging();
  }
  visiblePages(): number[] {
    if (this.totalPages <= 3) {
      return Array.from({ length: this.totalPages }, (_, i) => i);
    }

    if (this.pageIndex === 0) return [0, 1, 2];
    if (this.pageIndex === this.totalPages - 1)
      return [this.totalPages - 3, this.totalPages - 2, this.totalPages - 1];

    return [this.pageIndex - 1, this.pageIndex, this.pageIndex + 1];
  }
  statusClass(status: string): string {
    if (status === 'PAID') return 'paid';
    if (status === 'OVERDUE') return 'overdue';
    return 'due';
  }
}