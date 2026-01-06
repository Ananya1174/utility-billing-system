import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BillService } from '../../../services/bill';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './bill-details-dialog.html',
  styleUrls: ['./bill-details-dialog.css']
})
export class BillDetailsDialogComponent implements OnInit {

  bill: any = null;
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { billId: string },
    private dialogRef: MatDialogRef<BillDetailsDialogComponent>,
    private billService: BillService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.billService.getBillById(this.data.billId).subscribe({
      next: res => {
        this.bill = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  close(): void {
    this.dialogRef.close();
  }
}