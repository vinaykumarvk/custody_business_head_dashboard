import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopCustomer } from '../../../interfaces/dashboard.interface';

@Component({
  selector: 'app-top-customers-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-customers-table.component.html',
  styleUrls: ['./top-customers-table.component.scss']
})
export class TopCustomersTableComponent {
  @Input() data: TopCustomer[] = [];
  
  // For numeric formatting
  Math = Math;
  parseFloat = parseFloat;
  
  // Function to determine if change percent is positive
  isPositive(changePercent: string | number): boolean {
    const numValue = typeof changePercent === 'string' ? parseFloat(changePercent) : changePercent;
    return numValue >= 0;
  }
  
  // Format value with currency symbol
  formatCurrency(value: string | number, type: 'revenue' | 'assets' = 'revenue'): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (type === 'revenue') {
      return `$${numValue.toFixed(2)}M`;
    } else {
      return `$${numValue.toFixed(1)}B`;
    }
  }
}
