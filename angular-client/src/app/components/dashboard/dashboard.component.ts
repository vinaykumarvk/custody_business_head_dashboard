
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import * as interfaces from '../../interfaces/dashboard.interface';
import { MetricCardComponent } from './metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly formatNumberWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  customerMetrics?: interfaces.CustomerMetrics;
  customerGrowth: interfaces.CustomerGrowth[] = [];
  customerSegments: interfaces.CustomerSegment[] = [];
  aucMetrics?: interfaces.AucMetrics;
  income?: interfaces.Income;
  topCustomers: interfaces.TopCustomer[] = [];
  loading = true;
  error = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getCustomerMetrics().subscribe({
      next: (data) => this.customerMetrics = data,
      error: () => this.error = true,
      complete: () => this.loading = false
    });

    // Load other data similarly...
  }
}
