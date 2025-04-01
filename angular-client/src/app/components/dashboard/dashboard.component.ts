
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from './metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent],
  template: `
    <div class="dashboard">
      <h1>Custody Dashboard</h1>
      <div class="metrics-grid">
        <app-metric-card
          title="Total Customers"
          value="13,820"
          trend="+12%"
        />
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
  `]
})
export class DashboardComponent {}
