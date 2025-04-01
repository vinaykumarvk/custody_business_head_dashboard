
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from './metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  customerMetrics = {
    totalCustomers: 13820,
    activeCustomers: 9240,
    newCustomersMTD: 342
  };

  aucMetrics = {
    totalAuc: '157.3',
    growth: 5.2
  };

  income = {
    incomeMTD: '12.4',
    outstandingFees: '3.2',
    growth: 7.8
  };

  formatNumberWithCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
