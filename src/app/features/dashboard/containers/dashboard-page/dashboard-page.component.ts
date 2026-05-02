import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { AuthService } from '../../../../core/services/auth.service';
import { PAYMENT_LABELS } from '../../../../shared/models/sale.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  protected readonly facade = inject(DashboardFacade);
  protected readonly auth   = inject(AuthService);

  ngOnInit(): void { this.facade.load(); }

  firstName(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return '';
    return name.split(' ')[0] ?? name;
  }

  today(): string {
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  paymentLabel(m: string): string { return PAYMENT_LABELS[m as keyof typeof PAYMENT_LABELS] ?? m; }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  formatCurrency(v: number): string {
    return (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  rankClass(i: number): string {
    return i < 3 ? `rank-badge rank-${i}` : 'rank-badge rank-other';
  }

  barWidth(qty: number, max: number): number {
    return max > 0 ? Math.round((qty / max) * 100) : 0;
  }
}
