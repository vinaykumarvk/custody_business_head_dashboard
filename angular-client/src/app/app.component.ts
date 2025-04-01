import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent],
  template: `<router-outlet />`,
  styles: [],
})
export class AppComponent {
  title = 'Custody Dashboard';
}
