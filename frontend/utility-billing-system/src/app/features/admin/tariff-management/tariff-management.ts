import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tariff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tariff-management.html',
  styleUrl: './tariff-management.css'
})
export class TariffManagementComponent implements OnInit {

  plans: any[] = [];
  filteredPlans: any[] = [];

  utilityFilter = 'ALL';
  activeOnly = true;

  showAddPlan = false;

  newPlan = {
    utilityType: '',
    planCode: ''
  };

  selectedPlan: any = null;
  slabs: any[] = [];

  newSlab = {
    minUnits: null as number | null,
    maxUnits: null as number | null,
    rate: null as number | null
  };

  private baseUrl = 'http://localhost:8031/tariffs';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadActivePlans();
  }

  loadActivePlans() {
    this.http.get<any[]>(`${this.baseUrl}/plans/active`)
      .subscribe(res => {
        this.plans = res;
        this.applyFilter();
        this.cdr.detectChanges();
      });
  }

  applyFilter() {
    this.filteredPlans = this.plans.filter(p => {
      const utilityMatch =
        this.utilityFilter === 'ALL' || p.utilityType === this.utilityFilter;
      const activeMatch =
        !this.activeOnly || p.active === true;

      return utilityMatch && activeMatch;
    });
  }

  deactivatePlan(planId: string) {
    if (!confirm('Deactivate this tariff plan?')) return;

    this.http.put(`${this.baseUrl}/plans/${planId}/deactivate`, {})
      .subscribe(() => {
        this.loadActivePlans();
        this.closeSlabs();
      });
  }

  addPlan() {
    if (!this.newPlan.utilityType || !this.newPlan.planCode) {
      alert('All fields required');
      return;
    }

    this.http.post(`${this.baseUrl}/plans`, {
      utilityType: this.newPlan.utilityType,
      planCode: this.newPlan.planCode,
      active: true
    }).subscribe(() => {
      this.showAddPlan = false;
      this.newPlan = { utilityType: '', planCode: '' };
      this.loadActivePlans();
    });
  }

  openSlabs(plan: any) {
    this.selectedPlan = plan;
    this.newSlab = { minUnits: null, maxUnits: null, rate: null };

    this.http.get<any>(
      `${this.baseUrl}?utilityType=${plan.utilityType}`
    ).subscribe(res => {
      const planData = res.plans.find(
        (p: any) => p.planCode === plan.planCode
      );
      this.slabs = planData?.slabs || [];
      this.cdr.detectChanges();
    });
  }

  addSlab() {
    if (!this.selectedPlan?.active) return;

    if (
      this.newSlab.minUnits === null ||
      this.newSlab.maxUnits === null ||
      this.newSlab.rate === null ||
      this.newSlab.minUnits > this.newSlab.maxUnits
    ) {
      alert('Invalid slab values');
      return;
    }

    const payload = {
      utilityType: this.selectedPlan.utilityType,
      planCode: this.selectedPlan.planCode,
      minUnits: this.newSlab.minUnits,
      maxUnits: this.newSlab.maxUnits,
      rate: this.newSlab.rate
    };

    this.http.post(`${this.baseUrl}/slabs`, payload)
      .subscribe(() => {
        this.openSlabs(this.selectedPlan);
      });
  }

  closeSlabs() {
    this.selectedPlan = null;
    this.slabs = [];
  }
}