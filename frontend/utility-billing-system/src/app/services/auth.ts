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
forgotPassword(payload: { email: string }) {
  return this.http.post(
    'http://localhost:8031/auth/forgot-password',
    payload,
    { responseType: 'text' } 
  );
}

resetPassword(payload: { resetToken: string; newPassword: string }) {
  return this.http.post(
    'http://localhost:8031/auth/reset-password',
     payload,
    { responseType: 'text' }
  );
}
}