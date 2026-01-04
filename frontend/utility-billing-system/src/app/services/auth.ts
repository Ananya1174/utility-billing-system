import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:8031/auth';

  constructor(private http: HttpClient) {}

  // ================= AUTH APIs =================

  login(payload: { username: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, payload);
  }

  changePassword(payload: {
    oldPassword: string;
    newPassword: string;
  }) {
    return this.http.put(
      `${this.baseUrl}/change-password`,
      payload,
      { responseType: 'text' }
    );
  }

  forgotPassword(payload: { email: string }) {
    return this.http.post(
      `${this.baseUrl}/forgot-password`,
      payload,
      { responseType: 'text' }
    );
  }

  resetPassword(payload: { resetToken: string; newPassword: string }) {
    return this.http.post(
      `${this.baseUrl}/reset-password`,
      payload,
      { responseType: 'text' }
    );
  }

  // ================= TOKEN STORAGE =================

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================= JWT DECODING =================

  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // ================= JWT DATA ACCESS =================

  /** ✅ Comes from claim("userId", userId) */
  getUserId(): string | null {
    const payload = this.decodeToken();
    return payload?.userId || null;
  }

  /** ✅ Comes from claim("role", role) */
  getRole(): string | null {
    const payload = this.decodeToken();
    return payload?.role || null;
  }

  /** ✅ Comes from setSubject(username) */
  getUsername(): string | null {
    const payload = this.decodeToken();
    return payload?.sub || null;
  }

  // ================= ROLE HELPERS =================

  isConsumer(): boolean {
    return this.getRole() === 'CONSUMER';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
}