import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meter-readings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './meter-readings.html',
  styleUrls: ['./meter-readings.css']
})
export class MeterReadingsComponent {

  reading = {
    consumerId: '',
    connectionId: '',
    utilityType: '',
    meterNumber: '',
    currentReading: null as number | null,
    readingMonth: new Date().getMonth() + 1,
    readingYear: new Date().getFullYear()
  };

  submitting = false;

  constructor(
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
    private readonly snackBar: MatSnackBar
  ) {}

  submitReading(): void {
    if (!this.reading.currentReading) {
      this.snackBar.open(
        'Please enter current reading',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    this.submitting = true;

    this.http.post(
      'http://localhost:8031/meter-readings',
      this.reading
    ).subscribe({
      next: () => {
        this.submitting = false;

        this.snackBar.open(
          'Meter reading submitted successfully',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          }
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.submitting = false;

        this.snackBar.open(
          err.error?.message || 'Failed to submit meter reading',
          'Close',
          {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          }
        );

        this.cdr.detectChanges();
      }
    });
  }
}