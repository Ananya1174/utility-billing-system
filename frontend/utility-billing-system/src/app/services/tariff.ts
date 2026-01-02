import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TariffService {

  private baseUrl = 'http://localhost:8031';

  constructor(private http: HttpClient) {}

  getTariffsByUtility(utilityType: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/tariffs?utilityType=${utilityType}`
    );
  }
}
