import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:8031/auth';

  constructor(private http: HttpClient) {}

  changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}) {
  return this.http.put(
    `${this.baseUrl}/change-password`,
    payload,
    {
      responseType: 'text'  
    }
  );
}
}