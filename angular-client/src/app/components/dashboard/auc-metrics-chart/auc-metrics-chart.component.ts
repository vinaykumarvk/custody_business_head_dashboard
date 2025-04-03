import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-auc-metrics-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auc-metrics-chart.component.html',
  styleUrls: ['./auc-metrics-chart.component.scss']
})
export class AucMetricsChartComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chart: Chart | null = null;
  Math = Math;
  
  // Time range filter options
  timeRanges = ['3M', '6M', '1Y', 'ALL'];
  selectedTimeRange = '1Y'; // Default selection
  
  // Historical data will be generated
  historicalData: any[] = [];
  
  constructor() {}

  ngOnInit(): void {
    // Generate mock historical data for the component
    this.historicalData = this.generateMockHistoricalData();
  }

  ngAfterViewInit(): void {
    if (this.chartCanvas) {
      this.createChart();
    }
  }
  
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
  
  setTimeRange(range: string): void {
    this.selectedTimeRange = range;
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
  }

  createChart(): void {
    if (!this.chartCanvas) return;
    
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    // Filter data based on selected time range
    const filteredData = this.filterDataByTimeRange(this.historicalData);
    
    // Extract dates and values from filtered data
    const labels = filteredData.map(item => this.formatDate(new Date(item.date)));
    
    // Define asset classes and their colors
    const assetClasses = [
      { name: 'Equity', color: '#4285F4' },
      { name: 'Fixed Income', color: '#34A853' },
      { name: 'Mutual Funds', color: '#FBBC05' },
      { name: 'Others', color: '#EA4335' }
    ];
    
    // Create datasets for each asset class
    const datasets = assetClasses.map(asset => ({
      label: asset.name,
      data: filteredData.map(item => item[asset.name.toLowerCase().replace(' ', '_')]),
      backgroundColor: asset.color,
      borderColor: asset.color,
      borderWidth: 0,
      borderRadius: 4,
      barPercentage: 0.8,
      categoryPercentage: 0.8
    }));
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += `$${(context.parsed.y).toFixed(2)}B`;
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 12
            }
          },
          y: {
            stacked: true,
            grid: {
              color: '#f0f0f0'
            },
            ticks: {
              font: {
                size: 12
              },
              callback: (value) => `$${value}B`
            }
          }
        }
      }
    };
    
    this.chart = new Chart(ctx, config);
  }
  
  private generateMockHistoricalData(): any[] {
    const data = [];
    const now = new Date();
    
    // Start with some base values
    let equity = 42.5;
    let fixed_income = 30.2;
    let mutual_funds = 15.8;
    let others = 8.7;
    
    // Generate data for the past 24 months
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // Add some slight growth and random variations
      equity += (Math.random() * 0.8 - 0.3) + 0.2;
      fixed_income += (Math.random() * 0.5 - 0.2) + 0.15;
      mutual_funds += (Math.random() * 0.4 - 0.2) + 0.1;
      others += (Math.random() * 0.3 - 0.15) + 0.05;
      
      data.push({
        date: date.toISOString(),
        equity: parseFloat(equity.toFixed(2)),
        fixed_income: parseFloat(fixed_income.toFixed(2)),
        mutual_funds: parseFloat(mutual_funds.toFixed(2)),
        others: parseFloat(others.toFixed(2)),
        total: parseFloat((equity + fixed_income + mutual_funds + others).toFixed(2))
      });
    }
    
    return data;
  }
  
  private filterDataByTimeRange(data: any[]): any[] {
    if (this.selectedTimeRange === 'ALL') {
      return data;
    }
    
    const now = new Date();
    let months = 12; // Default for 1Y
    
    if (this.selectedTimeRange === '3M') {
      months = 3;
    } else if (this.selectedTimeRange === '6M') {
      months = 6;
    }
    
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
    return data.filter(item => new Date(item.date) >= cutoffDate);
  }
  
  private formatDate(date: Date): string {
    // Format as MM/YY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${month}/${year}`;
  }
}
