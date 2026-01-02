import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConsumerService {

  private baseUrl = 'http://localhost:8031';

  constructor(private http: HttpClient) {}

  // My approved utilities
  getMyUtilities() {
    return this.http.get<any[]>(`${this.baseUrl}/connections`);
  }

  // Create new connection request
  requestConnection(payload: any) {
    return this.http.post(
      `${this.baseUrl}/connections/requests`,
      payload,
      { observe: 'response' }
    );
  }

  // Pending requests
  getPendingRequests() {
    return this.http.get<any[]>(
      `${this.baseUrl}/connections/requests/pending`
    );
  }
}