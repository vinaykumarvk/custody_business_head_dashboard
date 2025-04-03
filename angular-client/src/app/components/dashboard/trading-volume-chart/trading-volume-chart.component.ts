import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { TradingVolume } from '../../../interfaces/dashboard.interface';

@Component({
  selector: 'app-trading-volume-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trading-volume-chart.component.html',
  styleUrls: ['./trading-volume-chart.component.scss']
})
export class TradingVolumeChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() data: TradingVolume[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chartInstance: Chart | null = null;
  timeRanges = ['3M', '6M', '1Y', 'All'];
  selectedTimeRange = '6M';

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
    const volumes = filteredData.map(item => typeof item.volume === 'string' ? parseFloat(item.volume) : item.volume);

    // Calculate gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(36, 72, 165, 0.4)');
    gradient.addColorStop(1, 'rgba(36, 72, 165, 0.0)');

    // Find the minimum volume to start y-axis from
    const minVolume = Math.floor(Math.min(...volumes));
    const maxVolume = Math.ceil(Math.max(...volumes));
    
    // Create a nice padding below the minimum (about 5% of the range)
    const padding = Math.max(0.5, Math.floor((maxVolume - minVolume) * 0.05));
    const yAxisMin = Math.max(0, minVolume - padding); // Ensure it doesn't go below 0

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Trading Volume (USD Billions)',
            data: volumes,
            borderColor: '#2448a5',
            backgroundColor: gradient,
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#2448a5',
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
            bottom: 15,
            left: 10,
            right: 10,
            top: 10
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
                size: 12
              },
              padding: 10
            }
          },
          y: {
            beginAtZero: false, // Don't force axis to start at zero
            min: yAxisMin, // Set the minimum value
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value + 'B';
              },
              padding: 10,
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
            callbacks: {
              label: function(context) {
                return 'Volume: $' + context.parsed.y + 'B';
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
    // Format as MM/YY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${month}/${year}`;
  }
}
