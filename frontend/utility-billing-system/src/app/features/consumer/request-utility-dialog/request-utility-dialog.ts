import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from '../../../services/utility';
import { AuthService } from '../../../services/auth';

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
  tariffPlans: string[] = [];
  availableUtilities: string[] = [];

  errorMsg = '';
  submitting = false;

  readonly ALL_UTILITIES = ['ELECTRICITY', 'WATER', 'GAS', 'INTERNET'];

  constructor(
    private utilityService: UtilityService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<RequestUtilityDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const blocked = data.existingUtilities || [];
    this.availableUtilities = this.ALL_UTILITIES.filter(
      u => !blocked.includes(u)
    );
  }

  onUtilityChange(): void {
    this.tariffPlan = '';
    this.tariffPlans = [];

    this.utilityService.getTariffs(this.utilityType).subscribe({
      next: (res) => {
        this.tariffPlans = res.plans.map((p: any) => p.planCode);
        this.cdr.detectChanges(); // ✅ update dropdown
      }
    });
  }

  submit(): void {
    if (!this.utilityType || !this.tariffPlan) {
      return;
    }

    const consumerId = this.authService.getUserId();

    if (!consumerId) {
      this.errorMsg = 'Session expired. Please login again.';
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    this.utilityService.requestConnection(
      {
        utilityType: this.utilityType,
        tariffPlan: this.tariffPlan
      },
      consumerId
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Request failed';
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}