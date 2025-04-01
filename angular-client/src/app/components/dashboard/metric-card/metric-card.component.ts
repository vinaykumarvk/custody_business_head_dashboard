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
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon?: string;
  @Input() subtitle?: string;
  @Input() change?: number;
  @Input() backgroundColor: string = 'white';
  @Input() textColor: string = '#2448a5';
  @Input() accentColor?: string;
  @Input() category?: 'customers' | 'revenue';

  get isPositive(): boolean {
    return this.change !== undefined && this.change >= 0;
  }

  get borderColor(): string {
    if (this.accentColor) return this.accentColor;
    return this.category === 'revenue' ? '#4caf50' : '#2448a5';
  }
}