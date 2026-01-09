import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';
@Component({
  selector: 'app-utility-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent], 
  templateUrl: './utility-requests.html',
  styleUrl: './utility-requests.css'
})
export class UtilityRequestsComponent implements OnInit {

  requests: any[] = [];
  approvingRequestId: string | null = null;
  meterNumber: string = '';

  private baseUrl = 'http://localhost:8031/connections/requests';

  // NEW
  showRejectDialog = false;
  rejectRequestId: string | null = null;

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
    this.rejectRequestId = requestId;
    this.showRejectDialog = true;
  }

  confirmReject() {
    if (!this.rejectRequestId) return;

    this.http.put(
      `${this.baseUrl}/${this.rejectRequestId}/reject`,
      {}
    ).subscribe(() => {
      this.showRejectDialog = false;
      this.rejectRequestId = null;
      this.loadPendingRequests();
    });
  }

  cancelReject() {
    this.showRejectDialog = false;
    this.rejectRequestId = null;
  }
}