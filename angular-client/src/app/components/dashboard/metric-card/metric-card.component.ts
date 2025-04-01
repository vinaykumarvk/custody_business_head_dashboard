
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card">
      <h3>{{ title }}</h3>
      <div class="value">{{ value }}</div>
      <div class="trend" [class.positive]="trend?.startsWith('+')">
        {{ trend }}
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h3 {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    .value {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0.5rem 0;
    }
    .trend {
      font-size: 0.9rem;
      color: #666;
      &.positive {
        color: #4CAF50;
      }
    }
  `]
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() trend?: string;
}
