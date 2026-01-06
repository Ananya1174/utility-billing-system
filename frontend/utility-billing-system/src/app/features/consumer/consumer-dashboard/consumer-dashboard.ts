import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, ChartOptions } from 'chart.js';


import { ConsumerService } from '../../../services/consumer';
import { BillService } from '../../../services/bill';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './consumer-dashboard.html',
  styleUrls: ['./consumer-dashboard.css']
})
export class ConsumerDashboard implements OnInit {

  @ViewChild('pieChart') pieChart?: BaseChartDirective;
  @ViewChild('barChart') barChart?: BaseChartDirective;
  @ViewChild('utilityCostChart') utilityCostChart?: BaseChartDirective;

  loading = true;
  summary: any;

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  utilityCostYear = new Date().getFullYear();
  selectedUtility = '';

  availableUtilities: string[] = [];

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  pieChartType: ChartType = 'pie';
  barChartType: ChartType = 'bar';
  doughnutChartType: ChartType = 'doughnut';
  utilityCostChartType: ChartType = 'doughnut';

  utilityCostChartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value}%`;
        }
      }
    }
  }
};
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ label: 'Units', data: [] }]
  };

  doughnutChartData: ChartData<'doughnut', number[], string> = {
    labels: ['Paid', 'Unpaid'],
    datasets: [{ data: [] }]
  };

  utilityCostChartData: ChartData<'doughnut', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#2563eb',
        '#16a34a',
        '#dc2626',
        '#f59e0b',
        '#7c3aed'
      ]
    }]
  };

  constructor(
    private consumerService: ConsumerService,
    private billService: BillService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.consumerService.getDashboardSummary().subscribe(res => {
      this.summary = res;
      this.loadUtilities();
      this.loadUtilityCostDistribution();
    });
  }

  loadUtilities(): void {
    const consumerId = this.authService.getUserId();
    if (!consumerId) return;

    this.billService.getConsumerBills(consumerId).subscribe(bills => {
      this.availableUtilities = [...new Set(bills.map(b => b.utilityType))];
      this.selectedUtility = this.availableUtilities[0];

      this.loadPieChart();
      this.loadBarChart();
      this.calculatePaidVsUnpaid(bills);

      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  loadPieChart(): void {
    const consumerId = this.authService.getUserId();
    if (!consumerId) return;

    this.billService.getConsumptionDashboard(
      consumerId,
      this.year,
      this.month,
      null
    ).subscribe(res => {
      this.pieChartData = {
        labels: res.byUtility.map(u => u.utilityType),
        datasets: [{ data: res.byUtility.map(u => u.units) }]
      };
      this.pieChart?.update();
    });
  }

  loadBarChart(): void {
    const consumerId = this.authService.getUserId();
    if (!consumerId) return;

    this.billService.getConsumptionDashboard(
      consumerId,
      this.year,
      null,
      this.selectedUtility
    ).subscribe(res => {
      const map: Record<number, number> = {};
      res.monthly.forEach(m => map[m.month] = m.units);

      this.barChartData = {
        labels: this.months.map(m => m.name),
        datasets: [{
          label: 'Units',
          data: this.months.map(m => map[m.value] || 0)
        }]
      };
      this.barChart?.update();
    });
  }

  calculatePaidVsUnpaid(bills: any[]): void {
    const paid = bills.filter(b => b.status === 'PAID').length;
    const unpaid = bills.length - paid;

    this.doughnutChartData = {
      labels: ['Paid', 'Unpaid'],
      datasets: [{ data: [paid, unpaid] }]
    };
  }

  loadUtilityCostDistribution(): void {
    const consumerId = this.authService.getUserId();
    if (!consumerId) return;

    this.billService.getUtilityCostDistribution(
      consumerId,
      this.utilityCostYear
    ).subscribe(res => {
      this.utilityCostChartData = {
        labels: res.map(r => r.utilityType),
        datasets: [{ data: res.map(r => r.percentage) }]
      };
      this.utilityCostChart?.update();
    });
  }

  onPieFilterChange() { this.loadPieChart(); }
  onBarFilterChange() { this.loadBarChart(); }
  onUtilityCostYearChange() { this.loadUtilityCostDistribution(); }

  goToBills() { this.router.navigate(['/consumer/bills']); }
  goToUtilities() { this.router.navigate(['/consumer/utilities']); }
  payDueBill() { this.router.navigate(['/consumer/bills']); }
}