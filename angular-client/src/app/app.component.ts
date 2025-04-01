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
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      height: 100vh;
      background-color: #F8FAFC;
    }
  `],
})
export class AppComponent {
  title = 'Custody Dashboard';
}
