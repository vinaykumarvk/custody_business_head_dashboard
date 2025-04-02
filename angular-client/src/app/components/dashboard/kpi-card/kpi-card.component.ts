
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  template: `
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
      <div class="mt-2 flex items-baseline">
        <p class="text-2xl font-semibold">{{ value }}</p>
        <p class="ml-2 flex items-baseline text-sm font-semibold" [ngClass]="trend >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ trend >= 0 ? '+' : '' }}{{ trend }}%
        </p>
      </div>
    </div>
  `
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() trend: number = 0;
}
