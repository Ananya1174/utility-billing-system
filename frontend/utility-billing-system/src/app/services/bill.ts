import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface UtilityConsumptionDto {
  utilityType: string;
  units: number;
}

export interface MonthlyConsumptionDto {
  month: number;
  units: number;
}

export interface ConsumptionDashboardResponse {
  byUtility: UtilityConsumptionDto[];
  monthly: MonthlyConsumptionDto[];
}
@Injectable({ providedIn: 'root' })
export class BillService {

  private baseUrl = 'http://localhost:8031';

  constructor(private http: HttpClient) {}
  getConsumptionDashboard(
    consumerId: string,
    year: number,
    month?: number | null,
    utilityType?: string | null
  ): Observable<ConsumptionDashboardResponse> {

    const params: any = {
      consumerId,
      year
    };

    if (month !== null && month !== undefined) {
      params.month = month;
    }

    if (utilityType) {
      params.utilityType = utilityType;
    }

    return this.http.get<ConsumptionDashboardResponse>(
      `${this.baseUrl}/dashboard/billing/consumption`,
      { params }
    );
  }
  getUtilityCostDistribution(
  consumerId: string,
  year: number
): Observable<{ utilityType: string; percentage: number }[]> {

  return this.http.get<{ utilityType: string; percentage: number }[]>(
    `${this.baseUrl}/dashboard/billing/utility-cost`,
    { params: { consumerId, year } }
  );
}

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

  getInvoice(paymentId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/payments/invoice/${paymentId}`
    );
  }

  downloadInvoice(paymentId: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/payments/invoice/${paymentId}/download`,
      { responseType: 'blob' }
    );
  }
getAllPayments() {
  return this.http.get<any[]>(
    `${this.baseUrl}/payments`
  );
}
}