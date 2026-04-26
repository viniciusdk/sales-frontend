import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { DashboardStats } from '../../../shared/models/sale.model';
import { SalesService } from '../../sales/services/sales.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private salesSvc = inject(SalesService);

  getStats(): Observable<DashboardStats> {
    return this.salesSvc.getAll().pipe(
      delay(300),
      map(sales => {
        const today = new Date().toDateString();
        const salesToday = sales.filter(s => new Date(s.createdAt).toDateString() === today);
        const monthStart = new Date(); monthStart.setDate(1);
        const salesMonth = sales.filter(s => new Date(s.createdAt) >= monthStart);

        const productQty: Record<string, { name: string; quantity: number }> = {};
        for (const s of sales) {
          for (const i of s.items) {
            if (!productQty[i.productId]) productQty[i.productId] = { name: i.productName, quantity: 0 };
            productQty[i.productId].quantity += i.quantity;
          }
        }
        const topProducts = Object.values(productQty)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        const byDay: Record<string, number> = {};
        for (const s of salesMonth) {
          const d = new Date(s.createdAt).toLocaleDateString('pt-BR');
          byDay[d] = (byDay[d] ?? 0) + s.total;
        }
        const revenueByDay = Object.entries(byDay)
          .map(([date, revenue]) => ({ date, revenue }))
          .sort((a, b) => a.date.localeCompare(b.date));

        return {
          totalSalesToday:    salesToday.length,
          totalRevenueToday:  salesToday.reduce((a, s) => a + s.total, 0),
          totalSalesMonth:    salesMonth.length,
          totalRevenueMonth:  salesMonth.reduce((a, s) => a + s.total, 0),
          topProducts,
          recentSales: sales.slice(0, 5),
          revenueByDay,
        };
      })
    );
  }
}
