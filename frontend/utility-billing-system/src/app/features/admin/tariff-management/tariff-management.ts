

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
  styleUrl: './tariff-management.css'
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
  /* MODALS / OVERLAY */
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
  /* DEACTIVATE CONFIRM */
  /* ===================== */

  confirmVisible = false;
  confirmPlanId: string | null = null;

  /* ===================== */
  /* API */
  /* ===================== */

  private baseUrl = 'http://localhost:8031/tariffs';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  /* ===================== */
  /* LOAD PLANS */
  /* ===================== */

  loadPlans() {
    this.loading = true;
    this.error = '';

    let url = `${this.baseUrl}/plans`;

    if (this.activeOnly) {
      url += '?active=true';
    }

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

  onFilterChange() {
    this.loadPlans();
  }

  /* ===================== */
  /* ADD PLAN MODAL */
  /* ===================== */

  openAddPlan() {
    this.showAddPlan = true;
  }

  closeAddPlan() {
    this.showAddPlan = false;
    this.newPlan = { utilityType: '', planCode: '' };
  }

  addPlan() {
    if (!this.newPlan.utilityType || !this.newPlan.planCode) {
      alert('All fields are required');
      return;
    }

    this.http.post(`${this.baseUrl}/plans`, this.newPlan)
      .subscribe(() => {
        this.closeAddPlan();
        this.loadPlans();
      });
  }

  /* ===================== */
  /* DEACTIVATE PLAN */
  /* ===================== */

  openDeactivateDialog(planId: string) {
    this.confirmPlanId = planId;
    this.confirmVisible = true;
  }

  confirmDeactivate() {
    if (!this.confirmPlanId) return;

    this.http
      .put(`${this.baseUrl}/plans/${this.confirmPlanId}/deactivate`, {})
      .subscribe(() => {
        this.confirmVisible = false;
        this.confirmPlanId = null;
        this.closeSlabs();
        this.loadPlans();
      });
  }

  cancelDeactivate() {
    this.confirmVisible = false;
    this.confirmPlanId = null;
  }

  /* ===================== */
  /* MANAGE SLABS */
  /* ===================== */

  openSlabs(plan: any) {
    this.selectedPlan = plan;
    this.showSlabsModal = true;
    this.newSlab = { minUnits: null, maxUnits: null, rate: null };

    this.http
      .get<any>(`${this.baseUrl}?utilityType=${plan.utilityType}`)
      .subscribe(res => {
        const planData = res.plans.find(
          (p: any) => p.planCode === plan.planCode
        );
        this.slabs = planData?.slabs || [];
        this.cdr.detectChanges();
      });
  }

  closeSlabs() {
    this.selectedPlan = null;
    this.slabs = [];
    this.showSlabsModal = false;
  }

  /* ===================== */
  /* SLAB VALIDATION */
  /* ===================== */

  private isOverlapping(newMin: number, newMax: number): boolean {
    return this.slabs.some(s =>
      !(newMax < s.minUnits || newMin > s.maxUnits)
    );
  }

  /* ===================== */
  /* ADD SLAB */
  /* ===================== */

  addSlab() {
    if (!this.selectedPlan?.active) return;

    const { minUnits, maxUnits, rate } = this.newSlab;

    if (
      minUnits === null ||
      maxUnits === null ||
      rate === null ||
      minUnits > maxUnits
    ) {
      alert('Invalid slab values');
      return;
    }

    if (this.isOverlapping(minUnits, maxUnits)) {
      alert('Slab range overlaps with existing slab');
      return;
    }

    const payload = {
      utilityType: this.selectedPlan.utilityType,
      planCode: this.selectedPlan.planCode,
      minUnits,
      maxUnits,
      rate
    };

    this.http.post(`${this.baseUrl}/slabs`, payload)
      .subscribe(() => this.openSlabs(this.selectedPlan));
  }

  /* ===================== */
  /* DELETE SLAB (FRONTEND) */
  /* ===================== */

  deleteSlab(slabId: string) {
    if (!confirm('Delete this slab?')) return;

    this.http
      .delete(`${this.baseUrl}/slabs/${slabId}`)
      .subscribe(() => {
        this.slabs = this.slabs.filter(s => s.id !== slabId);
        this.cdr.detectChanges();
      });
  }
}