
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { CustomerGrowthChartComponent } from './customer-growth-chart/customer-growth-chart.component';
import { CustomerSegmentsChartComponent } from './customer-segments-chart/customer-segments-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MetricCardComponent,
    CustomerGrowthChartComponent,
    CustomerSegmentsChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  error = false;
  
  customerMetrics = {
    totalCustomers: 13820,
    activeCustomers: 9240,
    newCustomersMTD: 342
  };

  customerGrowth = [
    { id: 1, date: '2023-01-01', totalCustomers: 10500, newCustomers: 150 },
    { id: 2, date: '2023-02-01', totalCustomers: 10800, newCustomers: 300 },
    { id: 3, date: '2023-03-01', totalCustomers: 11050, newCustomers: 250 },
    { id: 4, date: '2023-04-01', totalCustomers: 11200, newCustomers: 150 },
    { id: 5, date: '2023-05-01', totalCustomers: 11450, newCustomers: 250 },
    { id: 6, date: '2023-06-01', totalCustomers: 11650, newCustomers: 200 },
    { id: 7, date: '2023-07-01', totalCustomers: 11800, newCustomers: 150 },
    { id: 8, date: '2023-08-01', totalCustomers: 12100, newCustomers: 300 },
    { id: 9, date: '2023-09-01', totalCustomers: 12350, newCustomers: 250 },
    { id: 10, date: '2023-10-01', totalCustomers: 12800, newCustomers: 450 },
    { id: 11, date: '2023-11-01', totalCustomers: 13150, newCustomers: 350 },
    { id: 12, date: '2023-12-01', totalCustomers: 13400, newCustomers: 250 },
    { id: 13, date: '2024-01-01', totalCustomers: 13600, newCustomers: 200 },
    { id: 14, date: '2024-02-01', totalCustomers: 13820, newCustomers: 220 }
  ];

  customerSegments = [
    { id: 1, segmentName: 'Institutional', percentage: 45 },
    { id: 2, segmentName: 'Corporate', percentage: 30 },
    { id: 3, segmentName: 'HNI', percentage: 15 },
    { id: 4, segmentName: 'Funds', percentage: 10 }
  ];

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
