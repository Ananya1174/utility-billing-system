import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UtilityService } from '../../../services/utility';
import { RequestUtilityDialogComponent } from '../request-utility-dialog/request-utility-dialog';

@Component({
  selector: 'app-my-utilities',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './my-utilities.html',
  styleUrls: ['./my-utilities.css']
})
export class MyUtilitiesComponent implements OnInit {

  utilities: any[] = [];
  loading = true;

  constructor(
    private utilityService: UtilityService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadConnections();
  }

  loadConnections(): void {
    this.loading = true;

    this.utilityService.getConnections().subscribe({
      next: (res) => {
        this.utilities = this.normalizeConnections(res);
        this.loading = false;
        this.cdr.detectChanges(); // ✅ force UI refresh
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get hasUtilities(): boolean {
    return this.utilities.length > 0;
  }

  get canAddUtility(): boolean {
    const used = this.utilities.map(u => u.utilityType);
    return used.length < 4;
  }

  openRequestDialog(): void {
    const dialogRef = this.dialog.open(RequestUtilityDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        existingUtilities: this.utilities.map(u => u.utilityType)
      }
    });

    dialogRef.afterClosed().subscribe((refresh) => {
      if (refresh) {
        this.loadConnections(); // reload
      }
    });
  }

  private normalizeConnections(connections: any[]): any[] {
    const map = new Map<string, any>();

    for (const conn of connections) {
      const key = conn.utilityType;
      const existing = map.get(key);

      if (!existing) {
        map.set(key, conn);
        continue;
      }

      // Prefer connection with meter number
      if (!existing.meterNumber && conn.meterNumber) {
        map.set(key, conn);
        continue;
      }

      // If both have meter numbers → keep latest activated
      if (
        existing.meterNumber &&
        conn.meterNumber &&
        conn.activatedAt &&
        existing.activatedAt &&
        new Date(conn.activatedAt) > new Date(existing.activatedAt)
      ) {
        map.set(key, conn);
      }
    }

    return Array.from(map.values());
  }
}