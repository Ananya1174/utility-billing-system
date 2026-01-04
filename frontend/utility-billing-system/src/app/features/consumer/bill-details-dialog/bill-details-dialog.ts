import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BillService } from '../../../services/bill';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill-details-dialog.html'
})
export class BillDetailsDialogComponent implements OnInit {

  bill: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private billService: BillService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.billService.getBillById(this.data.billId).subscribe(res => {
      // ⬇️ defer update to next change-detection cycle
      setTimeout(() => {
        this.bill = res;
        this.cdr.markForCheck();
      });
    });
  }
}