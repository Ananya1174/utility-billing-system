import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-request-utility-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-utility-dialog.html',
  styleUrls: ['./request-utility-dialog.css']
})
export class RequestUtilityDialogComponent {

  utilityType = '';
  tariffPlan = '';

  availableUtilities = ['ELECTRICITY', 'WATER', 'GAS', 'INTERNET'];
  tariffPlans: string[] = [];

  constructor(private dialogRef: MatDialogRef<RequestUtilityDialogComponent>) {}

  onUtilityChange(): void {
    // 🔹 TEMP mock – later load from API
    if (this.utilityType === 'INTERNET') {
      this.tariffPlans = ['BASIC_50MBPS', 'PREMIUM_100MBPS'];
    } else {
      this.tariffPlans = ['DOMESTIC', 'COMMERCIAL'];
    }
  }

  submit(): void {
    console.log({
      utilityType: this.utilityType,
      tariffPlan: this.tariffPlan
    });
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}