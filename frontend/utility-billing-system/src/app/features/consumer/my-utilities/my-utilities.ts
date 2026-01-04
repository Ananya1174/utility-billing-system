import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RequestUtilityDialogComponent} from '../request-utility-dialog/request-utility-dialog';
@Component({
  selector: 'app-my-utilities',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './my-utilities.html',
  styleUrls: ['./my-utilities.css']
})
export class MyUtilitiesComponent implements OnInit {

  utilities: any[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // 🔹 TEMP: mock data (replace with API later)
    this.utilities = [
      {
        utilityType: 'INTERNET',
        tariffPlan: 'BASIC_50MBPS',
        status: 'PENDING',
        meterNumber: null,
        requestedAt: '2026-01-04T22:32:18.308'
      }
    ];
  }

  get hasUtilities(): boolean {
    return this.utilities.length > 0;
  }

  get canAddUtility(): boolean {
    return this.utilities.length < 4;
  }

  openRequestDialog(): void {
    this.dialog.open(RequestUtilityDialogComponent, {
      width: '400px',
      disableClose: true
    });
  }
}