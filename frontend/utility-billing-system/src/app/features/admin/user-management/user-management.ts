import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  activeTab: string = 'ALL';

  private baseUrl = 'http://localhost:8031/auth/users';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>(this.baseUrl)
      .subscribe(res => {
        this.users = res;
        this.applyFilter();
        this.cdr.detectChanges();
      });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  applyFilter() {
    if (this.activeTab === 'ALL') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(
        u => u.role === this.activeTab
      );
    }
  }

  deleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.http.delete(`${this.baseUrl}/${userId}`)
      .subscribe(() => {
        this.loadUsers();
      });
  }
}