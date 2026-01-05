import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BillService {

  private baseUrl = 'http://localhost:8031';

  constructor(private http: HttpClient) {}

  getConsumerBills(consumerId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/bills/consumer/${consumerId}`
    );
  }

  getBillById(billId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/bills/${billId}`
    );
  }
  // bill.ts
getPaymentsByBillId(billId: string) {
  return this.http.get<any[]>(
    `${this.baseUrl}/payments/bill/${billId}`
  );
}

  initiateOnlinePayment(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/payments/online/initiate`,
      payload
    );
  }

  confirmOnlinePayment(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/payments/online/confirm`,
      payload
    );
  }

  // ✅ VIEW INVOICE (paymentId)
  getInvoice(paymentId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/payments/invoice/${paymentId}`
    );
  }

  // ✅ DOWNLOAD INVOICE (paymentId)
  downloadInvoice(paymentId: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/payments/invoice/${paymentId}/download`,
      { responseType: 'blob' }
    );
  }
  // ✅ GET ALL PAYMENTS (Accounts Officer)
getAllPayments() {
  return this.http.get<any[]>(
    `${this.baseUrl}/payments`
  );
}
}