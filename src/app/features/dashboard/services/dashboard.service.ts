import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardStats } from '../../../shared/models/sale.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard/stats`).pipe(
      map(data => ({
        totalSalesToday:   data?.totalSalesToday   ?? 0,
        totalRevenueToday: data?.totalRevenueToday ?? 0,
        totalSalesMonth:   data?.totalSalesMonth   ?? 0,
        totalRevenueMonth: data?.totalRevenueMonth ?? 0,
        topProducts:       data?.topProducts       ?? [],
        recentSales:       data?.recentSales       ?? [],
        revenueByDay:      data?.revenueByDay      ?? [],
      }))
    );
  }
}
