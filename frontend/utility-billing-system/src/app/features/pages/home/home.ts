import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../shared/navbar/navbar';
import { AccountRequestsComponent } from "../../admin/account-requests/account-requests";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Navbar, AccountRequestsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  role: string | null = null;

  constructor() {
    this.role = localStorage.getItem('role');
  }
}