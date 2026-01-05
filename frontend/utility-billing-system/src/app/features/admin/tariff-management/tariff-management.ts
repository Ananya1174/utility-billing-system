import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-tariff-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './tariff-management.html',
  styleUrls: ['./tariff-management.css']
})
export class TariffManagementComponent implements OnInit {

  /* ===================== */
  /* DATA */
  /* ===================== */

  plans: any[] = [];
  slabs: any[] = [];
  selectedPlan: any = null;

  utilityFilter: 'ALL' | 'ELECTRICITY' | 'WATER' | 'GAS' | 'INTERNET' = 'ALL';
  activeOnly = true;

  loading = false;
  error = '';

  /* ===================== */
  /* MODALS */
  /* ===================== */

  showAddPlan = false;
  showSlabsModal = false;

  /* ===================== */
  /* ADD PLAN */
  /* ===================== */

  newPlan = {
    utilityType: '',
    planCode: ''
  };

  /* ===================== */
  /* ADD SLAB */
  /* ===================== */

  newSlab = {
    minUnits: null as number | null,
    maxUnits: null as number | null,
    rate: null as number | null
  };

  /* ===================== */
  /* CONFIRM DELETE SLAB */
  /* ===================== */

  confirmSlabVisible = false;
  slabToDelete: string | null = null;

  /* ===================== */
  /* API */
  /* ===================== */

  private baseUrl = 'http://localhost:8031/tariffs';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  /* ===================== */
  /* LOAD PLANS */
  /* ===================== */

  loadPlans(): void {
    this.loading = true;
    this.error = '';

    let url = `${this.baseUrl}/plans`;
    if (this.activeOnly) url += '?active=true';

    this.http.get<any[]>(url).subscribe({
      next: res => {
        this.plans =
          this.utilityFilter === 'ALL'
            ? res
            : res.filter(p => p.utilityType === this.utilityFilter);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load tariff plans';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadPlans();
  }

  /* ===================== */
  /* ADD PLAN */
  /* ===================== */

  addPlan(): void {
    if (!this.newPlan.utilityType || !this.newPlan.planCode) return;

    this.http.post(`${this.baseUrl}/plans`, this.newPlan).subscribe(() => {
      this.showAddPlan = false;
      this.newPlan = { utilityType: '', planCode: '' };
      this.loadPlans();
    });
  }
  // =====================
// DEACTIVATE PLAN (DIALOG)
// =====================

confirmPlanVisible = false;
confirmPlanId: string | null = null;

openDeactivateDialog(planId: string) {
  this.confirmPlanId = planId;
  this.confirmPlanVisible = true;
}

confirmDeactivate() {
  if (!this.confirmPlanId) return;

  this.http
    .put(`${this.baseUrl}/plans/${this.confirmPlanId}/deactivate`, {})
    .subscribe(() => {
      this.confirmPlanVisible = false;
      this.confirmPlanId = null;
      this.loadPlans();
      this.closeSlabs();
      this.cdr.detectChanges();
    });
}

cancelDeactivate() {
  this.confirmPlanVisible = false;
  this.confirmPlanId = null;
}

  /* ===================== */
  /* MANAGE SLABS */
  /* ===================== */

  openSlabs(plan: any): void {
    this.selectedPlan = plan;
    this.showSlabsModal = true;
    this.newSlab = { minUnits: null, maxUnits: null, rate: null };
    this.loadSlabs();
  }

  closeSlabs(): void {
    this.selectedPlan = null;
    this.slabs = [];
    this.showSlabsModal = false;
  }

  loadSlabs(): void {
    this.http
      .get<any>(`${this.baseUrl}?utilityType=${this.selectedPlan.utilityType}`)
      .subscribe(res => {
        const planData = res.plans.find(
          (p: any) => p.planCode === this.selectedPlan.planCode
        );
        this.slabs = planData?.slabs || [];
        this.cdr.detectChanges();
      });
  }

  /* ===================== */
  /* ADD SLAB */
  /* ===================== */

  addSlab(): void {
    if (!this.selectedPlan?.active) return;

    const { minUnits, maxUnits, rate } = this.newSlab;
    if (minUnits === null || maxUnits === null || rate === null) return;
    if (minUnits > maxUnits) return;

    const payload = {
      utilityType: this.selectedPlan.utilityType,
      planCode: this.selectedPlan.planCode,
      minUnits,
      maxUnits,
      rate
    };

    this.http.post(`${this.baseUrl}/slabs`, payload)
      .subscribe(() => this.loadSlabs());
  }

  /* ===================== */
  /* DELETE SLAB (DIALOG) */
  /* ===================== */

  openDeleteSlabDialog(slabId: string): void {
    this.slabToDelete = slabId;
    this.confirmSlabVisible = true;
  }

  confirmDeleteSlab(): void {
  if (!this.slabToDelete) return;

  this.http
    .delete(`${this.baseUrl}/slabs/${this.slabToDelete}`)
    .subscribe(() => {
      this.slabToDelete = null;
      this.confirmSlabVisible = false;

      // ✅ ALWAYS reload from backend
      this.loadSlabs();

      this.cdr.detectChanges();
    });
}

  cancelDeleteSlab(): void {
    this.slabToDelete = null;
    this.confirmSlabVisible = false;
  }
}