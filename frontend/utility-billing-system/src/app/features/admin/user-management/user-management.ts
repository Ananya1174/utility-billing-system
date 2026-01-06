
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit {
  confirmVisible = false;
userToDelete: string | null = null;

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

  openDeleteDialog(userId: string) {
  this.userToDelete = userId;
  this.confirmVisible = true;
}

confirmDelete() {
  if (!this.userToDelete) return;

  this.http
    .delete(`${this.baseUrl}/${this.userToDelete}`)
    .subscribe(() => {
      this.confirmVisible = false;
      this.userToDelete = null;
      this.loadUsers();
      this.cdr.detectChanges();
    });
}

cancelDelete() {
  this.confirmVisible = false;
  this.userToDelete = null;
}
}