import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { CustomerGrowth, CustomerHistory } from '../../../interfaces/dashboard.interface';

@Component({
  selector: 'app-customer-growth-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-growth-chart.component.html',
  styleUrls: ['./customer-growth-chart.component.scss']
})
export class CustomerGrowthChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() data: CustomerGrowth[] = [];
  @Input() historyData: CustomerHistory[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chartInstance: Chart | null = null;
  timeRanges = ['3M', '6M', '1Y', 'All'];
  selectedTimeRange = '1Y';

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['data'] || changes['historyData']) && this.chartCanvas) {
      this.createChart();
    }
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  setTimeRange(range: string) {
    this.selectedTimeRange = range;
    this.createChart();
  }

  private createChart() {
    if (!this.chartCanvas || !this.data || this.data.length === 0) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Filter data based on selected time range
    const now = new Date();
    let filteredData = [...this.data];
    
    if (this.selectedTimeRange === '3M') {
      const last3Months = this.subMonths(now, 3);
      filteredData = this.data.filter(item => new Date(item.date) >= last3Months);
    } else if (this.selectedTimeRange === '6M') {
      const last6Months = this.subMonths(now, 6);
      filteredData = this.data.filter(item => new Date(item.date) >= last6Months);
    } else if (this.selectedTimeRange === '1Y') {
      const lastYear = this.subMonths(now, 12);
      filteredData = this.data.filter(item => new Date(item.date) >= lastYear);
    }

    // Sort data from earliest to latest date
    filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels = filteredData.map(item => this.formatDate(new Date(item.date)));
    const customersData = filteredData.map(item => item.customers);

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Customers',
            data: customersData,
            borderColor: '#2448a5',
            backgroundColor: 'rgba(36, 72, 165, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 40,
            left: 20,
            right: 20,
            top: 20
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 12,
                weight: 'bold'
              },
              padding: 15,
              color: '#2448a5',
              maxTicksLimit: 12
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              precision: 0,
              padding: 15,
              font: {
                size: 12
              }
            }
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            padding: 12,
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 13
            }
          },
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 13
              },
              padding: 20
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  }

  private subMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
  }

  private formatDate(date: Date): string {
    // Format as MM/YY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${month}/${year}`;
  }
}
