import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

interface CustomerSegment {
  id: number;
  segmentName: string;
  percentage: string | number;
}

@Component({
  selector: 'app-customer-segments-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-segments-chart.component.html',
  styleUrls: ['./customer-segments-chart.component.scss']
})
export class CustomerSegmentsChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() data: CustomerSegment[] = [];
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

    const labels = this.data.map(segment => segment.segmentName);
    const percentages = this.data.map(segment => {
      return typeof segment.percentage === 'string' 
        ? parseFloat(segment.percentage) 
        : segment.percentage;
    });

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: percentages,
          backgroundColor: [
            '#2448a5',  // Blue
            '#C6DBFC',  // Light Blue
            '#7b7b7b',  // Gray
            '#90CAF9'   // Another shade of blue
          ],
          borderWidth: 0,
          hoverOffset: 4
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
                const label = context.label || '';
                const value = context.raw;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }
}