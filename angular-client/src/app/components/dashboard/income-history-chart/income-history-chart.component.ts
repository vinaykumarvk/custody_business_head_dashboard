import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { IncomeHistory } from '../../../interfaces/dashboard.interface';

@Component({
  selector: 'app-income-history-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './income-history-chart.component.html',
  styleUrls: ['./income-history-chart.component.scss']
})
export class IncomeHistoryChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() data: IncomeHistory[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chartInstance: Chart | null = null;
  timeRanges = ['3M', '6M', '1Y', 'All'];
  selectedTimeRange = '1Y';

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.chartCanvas) {
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

    // Sort data by date
    filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels = filteredData.map(item => this.formatDate(new Date(item.date)));
    const amounts = filteredData.map(item => typeof item.income === 'string' ? parseFloat(item.income) : item.income);

    // Calculate gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(36, 72, 165, 0.4)');
    gradient.addColorStop(1, 'rgba(36, 72, 165, 0.0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income (USD Millions)',
            data: amounts,
            borderColor: '#2448a5',
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#2448a5'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value + 'M';
              }
            }
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return 'Income: $' + context.parsed.y + 'M';
              }
            }
          },
          legend: {
            display: false
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}
