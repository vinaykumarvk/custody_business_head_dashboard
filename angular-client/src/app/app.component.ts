import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent],
  template: `
    <main class="app-container">
      <h1 class="dashboard-title">{{title}}</h1>
      <app-dashboard></app-dashboard>
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      height: 100vh;
      background-color: #F8FAFC;
      overflow-y: auto;
    }
    
    .dashboard-title {
      color: #2448a5;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 20px;
    }
  `],
})
export class AppComponent {
  title = 'Custody Dashboard';
}
