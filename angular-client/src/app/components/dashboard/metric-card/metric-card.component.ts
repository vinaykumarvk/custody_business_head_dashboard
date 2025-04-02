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
  @Input() value: number | string = '';
  @Input() icon?: string;
  @Input() subtitle?: string;
  @Input() change?: number;
  @Input() changePercent?: number;
  @Input() backgroundColor: string = 'white';
  @Input() textColor: string = '#2448a5';
  @Input() accentColor?: string;
  @Input() category?: 'customers' | 'revenue';
  @Input() colorClass?: string;
  
  // Make Math available to the template
  Math = Math;

  get isPositive(): boolean {
    if (this.change !== undefined) {
      return this.change >= 0;
    }
    if (this.changePercent !== undefined) {
      return this.changePercent >= 0;
    }
    return true;
  }

  get displayChange(): number | undefined {
    return this.change !== undefined ? this.change : this.changePercent;
  }

  get borderColor(): string {
    if (this.accentColor) return this.accentColor;
    return this.category === 'revenue' ? '#4caf50' : '#2448a5';
  }
}
