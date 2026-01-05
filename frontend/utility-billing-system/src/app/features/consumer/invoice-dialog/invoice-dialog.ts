

import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BillService } from '../../../services/bill';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-dialog.html',
  styleUrls: ['./invoice-dialog.css']
})
export class InvoiceDialogComponent implements OnInit {

  invoice: any = null;
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private billService: BillService,
    private dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.billService.getInvoice(this.data.paymentId).subscribe({
      next: (res) => {
        this.invoice = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /** ✅ REQUIRED BY TEMPLATE */
  close(): void {
    this.dialogRef.close();
  }
}