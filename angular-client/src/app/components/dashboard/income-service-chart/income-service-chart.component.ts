import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { IncomeByService } from '../../../interfaces/dashboard.interface';

@Component({
  selector: 'app-income-service-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './income-service-chart.component.html',
  styleUrls: ['./income-service-chart.component.scss']
})
export class IncomeServiceChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() data: IncomeByService[] = [];
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
    if (!this.chartCanvas || !this.data || this.data.length === 0) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const serviceNames = this.data.map(item => item.serviceName);
    const amounts = this.data.map(item => 
      typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount
    );
    
    // Calculate total to get percentages
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    const percentages = amounts.map(amount => ((amount / total) * 100).toFixed(1));

    // Colors for the chart
    const backgroundColors = [
      '#2448a5',   // Primary blue
      '#3e64bc',   // Slightly lighter blue
      '#5881d4',   // Even lighter blue
      '#729ded',   // Very light blue
      '#C6DBFC',   // Lightest blue
      '#7b7b7b',   // Gray
    ];

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: serviceNames,
        datasets: [{
          data: amounts,
          backgroundColor: backgroundColors.slice(0, serviceNames.length),
          borderWidth: 1,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              pointStyle: 'rectRounded',
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                // Only show percentage, not the amount value
                const label = context.label || '';
                const index = context.dataIndex;
                return `${label}: ${percentages[index]}%`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }
}
