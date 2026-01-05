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

  profile: any = {};
  loading = true;
  editing = false;
  saving = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const id = this.authService.getUserId();
    if (!id) return;

    this.http.get<any>(`http://localhost:8032/consumers/${id}`)
      .subscribe({
        next: res => {
          this.profile = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Failed to load profile';
        }
      });
  }

  enableEdit(): void {
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
    this.loadProfile();
  }

  updateProfile(): void {
    this.saving = true;

    const id = this.authService.getUserId();
    this.http.put(`http://localhost:8032/consumers/${id}`, this.profile)
      .subscribe({
        next: () => {
          this.saving = false;
          this.editing = false;
          this.successMsg = 'Profile updated successfully';
        },
        error: () => {
          this.saving = false;
          this.errorMsg = 'Update failed';
        }
      });
  }
}
