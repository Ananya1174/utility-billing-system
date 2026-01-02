import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-requests.html',
  styleUrl: './account-requests.css',
})
export class AccountRequestsComponent implements OnInit {

  requests: any[] = [];
  loading = false;

  private BASE_URL = 'http://localhost:8031/auth/account-requests';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;

    this.http.get<any[]>(`${this.BASE_URL}/pending`)
      .subscribe({
        next: (res) => {
          this.requests = res;
          this.loading = false;
          this.cdr.detectChanges(); 
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  reviewRequest(requestId: string, decision: 'APPROVE' | 'REJECT') {
    this.http.post(
      `${this.BASE_URL}/review`,
      { requestId, decision },
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.snackBar.open(
          `Request ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.requests = this.requests.filter(r => r.requestId !== requestId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open(
          'Action failed. Try again.',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}