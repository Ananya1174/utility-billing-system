import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  private baseUrl = 'http://localhost:8031';

  constructor(private http: HttpClient) {}

  getConnections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/connections`);
  }

  getTariffs(utilityType: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/tariffs`,
      { params: { utilityType } }
    );
  }

  requestConnection(payload: any, consumerId: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Consumer-Id': consumerId
    });

    return this.http.post(
      `${this.baseUrl}/connections/requests`,
      payload,
      { headers }
    );
  }
}