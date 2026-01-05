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

  profile = {
    fullName: '',
    email: '',
    mobileNumber: '',
    address: ''
  };

  originalProfile: any = {};

  loading = true;
  saving = false;
  editMode = false;

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
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.http.get<any>(`${this.baseUrl}/consumers/${userId}`).subscribe({
      next: res => {
        this.profile = { ...res };
        this.originalProfile = { ...res };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Unable to load profile';
      }
    });
  }

  enableEdit(): void {
    this.editMode = true;
    this.successMsg = '';
    this.errorMsg = '';
  }

  cancelEdit(): void {
    this.profile = { ...this.originalProfile };
    this.editMode = false;
  }

  updateProfile(): void {
    if (!this.editMode) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.http.put(`${this.baseUrl}/consumers/${userId}`, this.profile)
      .subscribe({
        next: () => {
          this.originalProfile = { ...this.profile };
          this.editMode = false;
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
