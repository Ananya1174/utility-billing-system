
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  activeTab: string = 'ALL';

  itemsPerPage = 10;
  currentPage = 1;

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
        this.currentPage = 1;
        this.cdr.detectChanges();
      });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.applyFilter();
    this.currentPage = 1;
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

  onPageSizeChange() {
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
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