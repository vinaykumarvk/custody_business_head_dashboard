import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as interfaces from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getCustomerMetrics(): Observable<interfaces.CustomerMetrics> {
    return this.http.get<interfaces.CustomerMetrics>(`${this.apiUrl}/customer-metrics`);
  }

  getCustomerGrowth(): Observable<interfaces.CustomerGrowth[]> {
    return this.http.get<interfaces.CustomerGrowth[]>(`${this.apiUrl}/customer-growth`);
  }

  getCustomerSegments(): Observable<interfaces.CustomerSegment[]> {
    return this.http.get<interfaces.CustomerSegment[]>(`${this.apiUrl}/customer-segments`);
  }

  getTradingVolume(): Observable<interfaces.TradingVolume[]> {
    return this.http.get<interfaces.TradingVolume[]>(`${this.apiUrl}/trading-volume`);
  }

  getAucHistory(): Observable<interfaces.AucHistory[]> {
    return this.http.get<interfaces.AucHistory[]>(`${this.apiUrl}/auc-history`);
  }

  getAucMetrics(): Observable<interfaces.AucMetrics> {
    return this.http.get<interfaces.AucMetrics>(`${this.apiUrl}/auc-metrics`);
  }

  getIncome(): Observable<interfaces.Income> {
    return this.http.get<interfaces.Income>(`${this.apiUrl}/income`);
  }

  getTopCustomers(): Observable<interfaces.TopCustomer[]> {
    return this.http.get<interfaces.TopCustomer[]>(`${this.apiUrl}/top-customers`);
  }
}