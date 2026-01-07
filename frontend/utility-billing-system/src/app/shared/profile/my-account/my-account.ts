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

  loading = true;
  account: any = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  const userId = this.authService.getUserId();
  if (!userId) return;

  this.account = {
    userId,
    username: this.authService.getUsername(),
    role: this.authService.getRole()
  };
  this.loading = false;

  this.http.get<any>(`http://localhost:8031/auth/users/${userId}`)
    .subscribe({
      next: res => this.account = res,
      error: () => {}
    });
}
}
