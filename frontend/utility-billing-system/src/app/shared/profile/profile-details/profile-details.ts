import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-details.html',
  styleUrls: ['./profile-details.css']
})
export class ProfileDetailsComponent implements OnInit {

  profile: any = {
    fullName: '',
    email: '',
    mobileNumber: '',
    address: ''
  };

  loading = true;
  saving = false;
  successMsg = '';
  errorMsg = '';

  private baseUrl = 'http://localhost:8032';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const consumerId = this.authService.getUserId();
    if (!consumerId) return;

    this.http
      .get<any>(`${this.baseUrl}/consumers/${consumerId}`)
      .subscribe({
        next: res => {
          this.profile = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Unable to load profile details';
        }
      });
  }

  updateProfile(): void {
    const consumerId = this.authService.getUserId();
    if (!consumerId) return;

    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';

    const payload = {
      fullName: this.profile.fullName,
      email: this.profile.email,
      mobileNumber: this.profile.mobileNumber,
      address: this.profile.address
    };

    this.http
      .put(`${this.baseUrl}/consumers/${consumerId}`, payload)
      .subscribe({
        next: () => {
          this.saving = false;
          this.successMsg = 'Profile updated successfully';
        },
        error: () => {
          this.saving = false;
          this.errorMsg = 'Failed to update profile';
        }
      });
  }
}