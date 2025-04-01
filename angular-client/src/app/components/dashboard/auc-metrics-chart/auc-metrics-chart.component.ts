import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { AucMetrics } from '../../../interfaces/dashboard.interface';

@Component({
  selector: 'app-auc-metrics-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auc-metrics-chart.component.html',
  styleUrls: ['./auc-metrics-chart.component.scss']
})
export class AucMetricsChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() data: AucMetrics | null = null;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chartInstance: Chart | null = null;

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

  private createChart() {
    if (!this.chartCanvas || !this.data) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = ['Equity', 'Fixed Income', 'Mutual Funds', 'Others'];
    const values = [
      parseFloat(this.data.equity.toString()),
      parseFloat(this.data.fixedIncome.toString()),
      parseFloat(this.data.mutualFunds.toString()),
      parseFloat(this.data.others.toString())
    ];

    this.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#2448a5',  // Blue
            '#C6DBFC',  // Light Blue
            '#7b7b7b',  // Gray
            '#DAE9FF'   // Another shade of light blue
          ],
          borderWidth: 1,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 15,
              usePointStyle: true,
              pointStyle: 'rectRounded',
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = values.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: $${value}B (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}
