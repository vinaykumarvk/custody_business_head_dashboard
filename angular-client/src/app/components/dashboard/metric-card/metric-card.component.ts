
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss']
})
export class MetricCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() icon?: string;
  @Input() subtitle?: string;
  @Input() change?: number;
  @Input() category?: 'customers' | 'revenue';

  get isPositive(): boolean {
    return this.change !== undefined && this.change >= 0;
  }

  get borderColor(): string {
    if (this.category === 'customers') {
      return '#2448a5';
    } else if (this.category === 'revenue') {
      return '#4caf50';
    }
    return '#2448a5';
  }
}
