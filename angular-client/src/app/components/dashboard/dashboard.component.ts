import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { CustomerGrowthChartComponent } from './customer-growth-chart/customer-growth-chart.component';
import { CustomerSegmentsChartComponent } from './customer-segments-chart/customer-segments-chart.component';
import { AucMetricsChartComponent } from './auc-metrics-chart/auc-metrics-chart.component';
import { TradingVolumeChartComponent } from './trading-volume-chart/trading-volume-chart.component';
import { TopCustomersTableComponent } from './top-customers-table/top-customers-table.component';
import { IncomeServiceChartComponent } from './income-service-chart/income-service-chart.component';
import { IncomeHistoryChartComponent } from './income-history-chart/income-history-chart.component';
import * as interfaces from '../../interfaces/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardComponent,
    CustomerGrowthChartComponent,
    CustomerSegmentsChartComponent,
    AucMetricsChartComponent,
    TradingVolumeChartComponent,
    TopCustomersTableComponent,
    IncomeServiceChartComponent,
    IncomeHistoryChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Data states
  customerMetrics: interfaces.CustomerMetrics | null = null;
  customerGrowth: interfaces.CustomerGrowth[] = [];
  customerSegments: interfaces.CustomerSegment[] = [];
  tradingVolume: interfaces.TradingVolume[] = [];
  aucHistory: interfaces.AucHistory[] = [];
  aucMetrics: interfaces.AucMetrics | null = null;
  income: interfaces.Income | null = null;
  incomeByService: interfaces.IncomeByService[] = [];
  incomeHistory: interfaces.IncomeHistory[] = [];
  topCustomers: interfaces.TopCustomer[] = [];
  
  // Loading states
  loading = {
    customerMetrics: true,
    customerGrowth: true,
    customerSegments: true,
    tradingVolume: true,
    aucHistory: true,
    aucMetrics: true,
    income: true,
    incomeByService: true,
    incomeHistory: true,
    topCustomers: true
  };

  // Error states
  error = {
    customerMetrics: false,
    customerGrowth: false,
    customerSegments: false,
    tradingVolume: false,
    aucHistory: false,
    aucMetrics: false,
    income: false,
    incomeByService: false,
    incomeHistory: false,
    topCustomers: false
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadCustomerMetrics();
    this.loadCustomerGrowth();
    this.loadCustomerSegments();
    this.loadTradingVolume();
    this.loadAucHistory();
    this.loadAucMetrics();
    this.loadIncome();
    this.loadIncomeHistory();
    this.loadTopCustomers();
  }

  loadCustomerMetrics(): void {
    this.loading.customerMetrics = true;
    this.error.customerMetrics = false;
    
    this.dashboardService.getCustomerMetrics().subscribe({
      next: (data) => {
        this.customerMetrics = data;
        this.loading.customerMetrics = false;
      },
      error: (err) => {
        console.error('Error loading customer metrics', err);
        this.loading.customerMetrics = false;
        this.error.customerMetrics = true;
      }
    });
  }

  loadCustomerGrowth(): void {
    this.loading.customerGrowth = true;
    this.error.customerGrowth = false;
    
    this.dashboardService.getCustomerGrowth().subscribe({
      next: (data) => {
        this.customerGrowth = data;
        this.loading.customerGrowth = false;
      },
      error: (err) => {
        console.error('Error loading customer growth', err);
        this.loading.customerGrowth = false;
        this.error.customerGrowth = true;
      }
    });
  }

  loadCustomerSegments(): void {
    this.loading.customerSegments = true;
    this.error.customerSegments = false;
    
    this.dashboardService.getCustomerSegments().subscribe({
      next: (data) => {
        this.customerSegments = data;
        this.loading.customerSegments = false;
      },
      error: (err) => {
        console.error('Error loading customer segments', err);
        this.loading.customerSegments = false;
        this.error.customerSegments = true;
      }
    });
  }

  loadTradingVolume(): void {
    this.loading.tradingVolume = true;
    this.error.tradingVolume = false;
    
    this.dashboardService.getTradingVolume().subscribe({
      next: (data) => {
        this.tradingVolume = data;
        this.loading.tradingVolume = false;
      },
      error: (err) => {
        console.error('Error loading trading volume', err);
        this.loading.tradingVolume = false;
        this.error.tradingVolume = true;
      }
    });
  }

  loadAucHistory(): void {
    this.loading.aucHistory = true;
    this.error.aucHistory = false;
    
    this.dashboardService.getAucHistory().subscribe({
      next: (data) => {
        this.aucHistory = data;
        this.loading.aucHistory = false;
      },
      error: (err) => {
        console.error('Error loading AUC history', err);
        this.loading.aucHistory = false;
        this.error.aucHistory = true;
      }
    });
  }

  loadAucMetrics(): void {
    this.loading.aucMetrics = true;
    this.error.aucMetrics = false;
    
    this.dashboardService.getAucMetrics().subscribe({
      next: (data) => {
        this.aucMetrics = data;
        this.loading.aucMetrics = false;
      },
      error: (err) => {
        console.error('Error loading AUC metrics', err);
        this.loading.aucMetrics = false;
        this.error.aucMetrics = true;
      }
    });
  }

  loadIncome(): void {
    this.loading.income = true;
    this.error.income = false;
    
    this.dashboardService.getIncome().subscribe({
      next: (data) => {
        this.income = data;
        this.loading.income = false;
      },
      error: (err) => {
        console.error('Error loading income', err);
        this.loading.income = false;
        this.error.income = true;
      }
    });
    
    // Also load income by service data
    this.loading.incomeByService = true;
    this.error.incomeByService = false;
    
    this.dashboardService.getIncomeByService().subscribe({
      next: (data) => {
        this.incomeByService = data;
        this.loading.incomeByService = false;
      },
      error: (err) => {
        console.error('Error loading income by service', err);
        this.loading.incomeByService = false;
        this.error.incomeByService = true;
      }
    });
  }
  
  loadIncomeHistory(): void {
    this.loading.incomeHistory = true;
    this.error.incomeHistory = false;
    
    this.dashboardService.getIncomeHistory().subscribe({
      next: (data) => {
        this.incomeHistory = data;
        this.loading.incomeHistory = false;
      },
      error: (err) => {
        console.error('Error loading income history', err);
        this.loading.incomeHistory = false;
        this.error.incomeHistory = true;
      }
    });
  }

  loadTopCustomers(): void {
    this.loading.topCustomers = true;
    this.error.topCustomers = false;
    
    this.dashboardService.getTopCustomers().subscribe({
      next: (data) => {
        this.topCustomers = data;
        this.loading.topCustomers = false;
      },
      error: (err) => {
        console.error('Error loading top customers', err);
        this.loading.topCustomers = false;
        this.error.topCustomers = true;
      }
    });
  }
}
