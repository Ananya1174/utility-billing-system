import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BillService } from '../../../services/bill';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-dialog.html'
})
export class InvoiceDialogComponent implements OnInit {

  invoice: any = null;
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private billService: BillService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.billService.getInvoice(this.data.paymentId).subscribe({
      next: (res) => {
        this.invoice = res;
        this.loading = false;

        // ✅ safest fix
        setTimeout(() => {
          this.cdr.markForCheck();
        });
      }
    });
  }
}