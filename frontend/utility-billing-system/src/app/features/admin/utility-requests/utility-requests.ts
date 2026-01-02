import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-utility-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utility-requests.html',
  styleUrl: './utility-requests.css'
})
export class UtilityRequestsComponent implements OnInit {

  requests: any[] = [];
  approvingRequestId: string | null = null;
  meterNumber: string = '';

  private baseUrl = 'http://localhost:8031/connections/requests';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    this.http.get<any[]>(`${this.baseUrl}/pending`)
      .subscribe(res => {
        this.requests = res;
        this.cdr.detectChanges();
      });
  }

  startApprove(requestId: string) {
    this.approvingRequestId = requestId;
    this.meterNumber = '';
  }

  approve(requestId: string) {
    if (!this.meterNumber.trim()) {
      alert('Meter number is required');
      return;
    }

    this.http.put(
      `${this.baseUrl}/${requestId}/approve`,
      { meterNumber: this.meterNumber }
    ).subscribe(() => {
      this.approvingRequestId = null;
      this.loadPendingRequests();
    });
  }

  reject(requestId: string) {
    if (!confirm('Are you sure you want to reject this request?')) return;

    this.http.put(
      `${this.baseUrl}/${requestId}/reject`,
      {}
    ).subscribe(() => {
      this.loadPendingRequests();
    });
  }
}