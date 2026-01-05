import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generate-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-bills.html',
  styleUrls: ['./generate-bills.css']
})
export class GenerateBillsComponent {

  consumerId = '';
  connectionId = '';

  loading = false;
  message = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  generateBill(): void {
    this.loading = true;
    this.message = '';

    this.http.post(
      'http://localhost:8031/bills',
      {
        consumerId: this.consumerId,
        connectionId: this.connectionId
      }
    ).subscribe({
      next: () => {
        this.message = 'Bill generated successfully';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.message = err.error?.message || 'Bill generation failed';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}