import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentsService {

  private baseUrl = 'http://localhost:8031/payments';

  constructor(private http: HttpClient) {}

  initiateOnlinePayment(payload: any) {
    return this.http.post<any>(
      `${this.baseUrl}/online/initiate`,
      payload
    );
  }

  confirmOnlinePayment(payload: any) {
    return this.http.post(
      `${this.baseUrl}/online/confirm`,
      payload
    );
  }
}
