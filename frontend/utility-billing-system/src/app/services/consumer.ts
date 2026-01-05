import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConsumerService {

  private baseUrl = 'http://localhost:8031/consumers';

  constructor(private http: HttpClient) {}

  // ✅ DASHBOARD SUMMARY
  getDashboardSummary(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/dashboard/summary`
    );
  }
}