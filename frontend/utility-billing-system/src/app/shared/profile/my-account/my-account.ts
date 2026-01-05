import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-account.html',
  styleUrls: ['./my-account.css']
})
export class MyAccountComponent implements OnInit {

  account: any = null;
  loading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAccount();
  }

  loadAccount(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.http
      .get<any>(`http://localhost:8030/auth/users/${userId}`)
      .subscribe({
        next: res => {
          this.account = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }


}