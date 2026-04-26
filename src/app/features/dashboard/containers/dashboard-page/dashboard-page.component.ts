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
      <!-- Header -->
      <div class="dashboard-header animate-in">
        <div>
          <h1 class="page-title">Olá, {{ firstName() }} 👋</h1>
          <p class="page-subtitle" style="text-transform: capitalize;">{{ today() }} · Bem-vinda à Valdete Modas</p>
        </div>
        <a routerLink="/sales/new" class="btn btn-primary btn-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Nova Venda
        </a>
      </div>

      @if (facade.stats(); as s) {
        <!-- Stat cards -->
        <div class="stats-grid animate-in animate-in-delay-1">
          <div class="stat-card">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #7B2D8B, rgba(123,45,139,0.33));"></div>
            <div class="stat-top-row">
              <div class="stat-icon stat-icon-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#7B2D8B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <span class="stat-delta delta-purple">↑ +12%</span>
            </div>
            <div class="stat-label">Faturamento Hoje</div>
            <div class="stat-value">{{ formatCurrency(s.totalRevenueToday) }}</div>
          </div>

          <div class="stat-card">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #1565C0, rgba(21,101,192,0.33));"></div>
            <div class="stat-top-row">
              <div class="stat-icon stat-icon-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#1565C0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              </div>
              <span class="stat-delta delta-blue">↑ +3</span>
            </div>
            <div class="stat-label">Vendas Hoje</div>
            <div class="stat-value">{{ s.totalSalesToday }}</div>
          </div>

          <div class="stat-card">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #2E7D32, rgba(46,125,50,0.33));"></div>
            <div class="stat-top-row">
              <div class="stat-icon stat-icon-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2E7D32" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              </div>
              <span class="stat-delta delta-green">↑ +8%</span>
            </div>
            <div class="stat-label">Faturamento Mês</div>
            <div class="stat-value">{{ formatCurrency(s.totalRevenueMonth) }}</div>
          </div>

          <div class="stat-card">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #B45309, rgba(180,83,9,0.33));"></div>
            <div class="stat-top-row">
              <div class="stat-icon stat-icon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#B45309" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <span class="stat-delta delta-orange">↑ +22</span>
            </div>
            <div class="stat-label">Vendas no Mês</div>
            <div class="stat-value">{{ s.totalSalesMonth }}</div>
          </div>
        </div>

        <!-- Bottom row -->
        <div class="dashboard-bottom animate-in animate-in-delay-2">
          <!-- Recent sales -->
          <div class="card" style="padding: 24px; flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
              <h3 class="section-title">Últimas Vendas</h3>
              <a routerLink="/sales" class="btn btn-ghost btn-sm">Ver todas →</a>
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
          <div class="card" style="padding: 24px; width: 290px; flex-shrink: 0;">
            <h3 class="section-title" style="margin-bottom: 18px;">Mais Vendidos</h3>

            @if (s.topProducts.length === 0) {
              <p class="text-muted" style="font-size: 0.875rem;">Sem dados ainda</p>
            } @else {
              <div class="top-products-list">
                @for (p of s.topProducts; track p.name; let i = $index) {
                  <div style="margin-bottom: 13px;">
                    <div class="top-product-item">
                      <span class="rank-badge" [class]="rankClass(i)">{{ i + 1 }}</span>
                      <span class="top-product-name">{{ p.name }}</span>
                      <span class="top-product-qty">{{ p.quantity }}</span>
                    </div>
                    <div class="top-product-bar">
                      <div class="top-product-bar-fill" [style.width.%]="barWidth(p.quantity, s.topProducts[0].quantity)"></div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Quick links -->
        <div class="quick-links animate-in animate-in-delay-3">
          <a routerLink="/products/new" class="quick-link-card">
            <div class="quick-link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <span>Cadastrar Produto</span>
          </a>
          <a routerLink="/products/import" class="quick-link-card">
            <div class="quick-link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <span>Importar Produtos</span>
          </a>
          <a routerLink="/users" class="quick-link-card">
            <div class="quick-link-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <span>Gerenciar Usuários</span>
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
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 22px;
    }

    .stat-card {
      background: var(--color-bg-card);
      border-radius: 16px;
      padding: 20px 22px;
      box-shadow: 0 1px 4px rgba(110,36,128,0.06), 0 4px 14px rgba(110,36,128,0.05);
      border: 1px solid #EAD8F8;
      position: relative; overflow: hidden;
    }

    .stat-top-row {
      display: flex; align-items: flex-start;
      justify-content: space-between; margin-bottom: 14px;
    }

    .stat-icon {
      width: 46px; height: 46px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .stat-icon-purple { background: #F0DFFB; }
    .stat-icon-blue   { background: #E3F2FD; }
    .stat-icon-green  { background: #E8F5E9; }
    .stat-icon-orange { background: #FEF3C7; }

    .stat-delta {
      font-size: 0.7rem; font-weight: 800;
      padding: 3px 9px; border-radius: 999px;
    }
    .delta-purple { background: #F0DFFB; color: #7B2D8B; }
    .delta-blue   { background: #E3F2FD; color: #1565C0; }
    .delta-green  { background: #E8F5E9; color: #2E7D32; }
    .delta-orange { background: #FEF3C7; color: #B45309; }

    .stat-label {
      font-size: 0.68rem; font-weight: 800;
      color: var(--color-text-muted);
      text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;
    }
    .stat-value {
      font-family: var(--font-display);
      font-size: 1.5rem; font-weight: 700;
      color: var(--color-text); line-height: 1.15;
    }

    .dashboard-bottom { display: flex; gap: 18px; margin-bottom: 22px; }

    .section-title {
      font-family: var(--font-display);
      font-size: 1rem; font-weight: 700;
      color: var(--color-primary-dark);
      margin: 0;
    }

    .recent-sales-list { display: flex; flex-direction: column; gap: 8px; }
    .recent-sale-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 13px; background: #FBF4FE;
      border-radius: 11px; border: 1px solid #EDE0F8;
    }
    .sale-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #D8C0F0, #B060C8);
      color: #4A1058;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
      font-family: var(--font-display);
    }
    .sale-info { flex: 1; }
    .sale-customer { display: block; font-size: 0.865rem; font-weight: 700; }
    .sale-meta { display: block; font-size: 0.72rem; color: var(--color-text-muted); }
    .sale-total { color: #4A1868; font-size: 0.9rem; font-family: var(--font-display); }

    .top-products-list { display: flex; flex-direction: column; }
    .top-product-item { display: flex; align-items: center; gap: 9px; margin-bottom: 5px; }
    .rank-badge {
      width: 21px; height: 21px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.68rem; font-weight: 800; flex-shrink: 0;
    }
    .rank-0 { background: #FFD700; color: #7A5C00; }
    .rank-1 { background: #C0C0C0; color: #444; }
    .rank-2 { background: #CD7F32; color: #fff; }
    .rank-other { background: var(--color-accent); color: var(--color-text-muted); }
    .top-product-name { flex: 1; font-size: 0.82rem; font-weight: 600; }
    .top-product-qty  { font-size: 0.72rem; color: var(--color-text-muted); }
    .top-product-bar  { height: 4px; background: #F0E8F8; border-radius: 2px; margin-left: 30px; }
    .top-product-bar-fill { height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-secondary)); border-radius: 2px; }

    .quick-links { display: flex; gap: 13px; }
    .quick-link-card {
      display: flex; align-items: center; gap: 11px;
      padding: 15px 18px; border-radius: 13px;
      background: var(--color-bg-card); border: 1.5px solid #E8D8F8;
      color: var(--color-text); text-decoration: none;
      font-size: 0.855rem; font-weight: 700;
      transition: all 0.15s; flex: 1;
    }
    .quick-link-card:hover {
      border-color: var(--color-primary-light);
      color: var(--color-primary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    .quick-link-icon { color: var(--color-primary); }

    .skeleton-card {
      height: 130px;
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
