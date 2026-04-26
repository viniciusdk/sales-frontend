import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { AuthService } from '../../../../core/services/auth.service';
import { PAYMENT_LABELS } from '../../../../shared/models/sale.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  template: `
    <div class="animate-in">
      <!-- Welcome header -->
      <div class="dashboard-header animate-in">
        <div>
          <h1 class="page-title">
            Olá, {{ firstName() }}
            <span class="wave">👋</span>
          </h1>
          <p class="page-subtitle">{{ today() }} · Bem-vinda à Valdete Modas</p>
        </div>
      </div>

      @if (facade.stats(); as s) {
        <!-- Stat cards -->
        <div class="stats-grid animate-in animate-in-delay-1">
          <div class="stat-card">
            <div class="stat-icon stat-icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="stat-body">
              <span class="stat-label">Faturamento Hoje</span>
              <span class="stat-value">{{ formatCurrency(s.totalRevenueToday) }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div class="stat-body">
              <span class="stat-label">Vendas Hoje</span>
              <span class="stat-value">{{ s.totalSalesToday }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <div class="stat-body">
              <span class="stat-label">Faturamento Mês</span>
              <span class="stat-value">{{ formatCurrency(s.totalRevenueMonth) }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            <div class="stat-body">
              <span class="stat-label">Vendas no Mês</span>
              <span class="stat-value">{{ s.totalSalesMonth }}</span>
            </div>
          </div>
        </div>

        <!-- Bottom row -->
        <div class="dashboard-bottom animate-in animate-in-delay-2">
          <!-- Recent sales -->
          <div class="card" style="padding: 24px; flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <h3 class="section-title">Últimas Vendas</h3>
              <a routerLink="/sales" class="btn btn-ghost btn-sm">Ver todas</a>
            </div>

            @if (s.recentSales.length === 0) {
              <div class="empty-state" style="padding: 20px;">
                <p style="font-size: 0.875rem;">Nenhuma venda ainda</p>
              </div>
            } @else {
              <div class="recent-sales-list">
                @for (sale of s.recentSales; track sale.id) {
                  <div class="recent-sale-item">
                    <div class="sale-avatar">
                      {{ sale.customerName ? sale.customerName.charAt(0).toUpperCase() : 'C' }}
                    </div>
                    <div class="sale-info">
                      <span class="sale-customer">{{ sale.customerName || 'Cliente' }}</span>
                      <span class="sale-meta">{{ formatDate(sale.createdAt) }} · {{ paymentLabel(sale.paymentMethod) }}</span>
                    </div>
                    <strong class="sale-total">{{ formatCurrency(sale.total) }}</strong>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Top products -->
          <div class="card" style="padding: 24px; width: 300px; flex-shrink: 0;">
            <h3 class="section-title" style="margin-bottom: 16px;">Produtos Mais Vendidos</h3>

            @if (s.topProducts.length === 0) {
              <p class="text-muted" style="font-size: 0.875rem;">Sem dados ainda</p>
            } @else {
              <div class="top-products-list">
                @for (p of s.topProducts; track p.name; let i = $index) {
                  <div class="top-product-item">
                    <span class="rank-badge" [class]="rankClass(i)">{{ i + 1 }}</span>
                    <span class="top-product-name">{{ p.name }}</span>
                    <span class="top-product-qty">{{ p.quantity }} un.</span>
                  </div>
                  @if (i < s.topProducts.length - 1) {
                    <div class="top-product-bar">
                      <div class="top-product-bar-fill" [style.width.%]="barWidth(p.quantity, s.topProducts[0].quantity)"></div>
                    </div>
                  }
                }
              </div>
            }
          </div>
        </div>

        <!-- Quick links -->
        <div class="quick-links animate-in animate-in-delay-3">
          <a routerLink="/products/new" class="quick-link-card">
            <div class="quick-link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            </div>
            <span>Cadastrar Produto</span>
          </a>
          <a routerLink="/products" class="quick-link-card">
            <div class="quick-link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
            <span>Ver Produtos</span>
          </a>
          <a routerLink="/sales" class="quick-link-card">
            <div class="quick-link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <span>Histórico de Vendas</span>
          </a>
        </div>
      } @else {
        <!-- Skeleton -->
        <div class="stats-grid">
          @for (_ of [1,2,3,4]; track _) {
            <div class="stat-card skeleton-card"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .wave { font-style: normal; }

    .header-floral {
      width: 200px; height: 60px;
      flex-shrink: 0; opacity: 0.9;
      pointer-events: none;
    }
    @media (max-width: 640px) { .header-floral { display: none; } }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex; align-items: center; gap: 16px;
      padding: 20px 24px;
    }

    .stat-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon-purple { background: var(--color-accent); color: var(--color-primary-dark); }
    .stat-icon-green  { background: #E8F5E9; color: #2E7D32; }
    .stat-icon-blue   { background: #E3F2FD; color: #1565C0; }
    .stat-icon-orange { background: #FFF3E0; color: #E65100; }

    .stat-body { display: flex; flex-direction: column; gap: 2px; }
    .stat-label { font-size: 0.78rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .stat-value { font-size: 1.4rem; font-weight: 700; color: var(--color-text); font-family: var(--font-display); line-height: 1.2; }

    .dashboard-bottom { display: flex; gap: 20px; margin-bottom: 24px; }

    .section-title {
      font-family: var(--font-display);
      font-size: 1rem; font-weight: 700;
      color: var(--color-primary-dark);
      margin: 0;
    }

    .recent-sales-list { display: flex; flex-direction: column; gap: 12px; }
    .recent-sale-item { display: flex; align-items: center; gap: 12px; }
    .sale-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--color-accent); color: var(--color-primary-dark);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
    }
    .sale-info { flex: 1; }
    .sale-customer { display: block; font-size: 0.875rem; font-weight: 600; }
    .sale-meta { display: block; font-size: 0.75rem; color: var(--color-text-muted); }
    .sale-total { color: var(--color-primary-dark); font-size: 0.9rem; }

    .top-products-list { display: flex; flex-direction: column; gap: 8px; }
    .top-product-item { display: flex; align-items: center; gap: 10px; }
    .rank-badge {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
    }
    .rank-0 { background: #FFD700; color: #7A5C00; }
    .rank-1 { background: #C0C0C0; color: #444; }
    .rank-2 { background: #CD7F32; color: #fff; }
    .rank-other { background: var(--color-accent-light); color: var(--color-text-muted); }
    .top-product-name { flex: 1; font-size: 0.83rem; font-weight: 500; }
    .top-product-qty { font-size: 0.78rem; color: var(--color-text-muted); }
    .top-product-bar { height: 4px; background: var(--color-accent-light); border-radius: 2px; margin: 0 0 4px 32px; }
    .top-product-bar-fill { height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-secondary)); border-radius: 2px; }

    .quick-links { display: flex; gap: 16px; }
    .quick-link-card {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px; border-radius: var(--radius-md);
      background: var(--color-bg-card); border: 1.5px solid var(--color-border);
      color: var(--color-text); text-decoration: none;
      font-size: 0.875rem; font-weight: 600;
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
      flex: 1;
    }
    .quick-link-card:hover {
      border-color: var(--color-primary-light);
      box-shadow: var(--shadow-sm);
      transform: translateY(-2px);
      color: var(--color-primary);
    }
    .quick-link-icon { color: var(--color-primary); }

    .skeleton-card {
      height: 88px;
      background: linear-gradient(90deg, var(--color-accent-light) 25%, #fff 50%, var(--color-accent-light) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .dashboard-bottom { flex-direction: column; }
      .dashboard-bottom .card:last-child { width: 100%; }
      .quick-links { flex-direction: column; }
    }
    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `],
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
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  rankClass(i: number): string {
    return i < 3 ? `rank-badge rank-${i}` : 'rank-badge rank-other';
  }

  barWidth(qty: number, max: number): number {
    return max > 0 ? Math.round((qty / max) * 100) : 0;
  }
}
