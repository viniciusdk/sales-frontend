import { Component, inject, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SalesFacade } from '../../facades/sales.facade';
import { PAYMENT_LABELS } from '../../../../shared/models/sale.model';

@Component({
  selector: 'app-sales-list-page',
  imports: [RouterLink],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Vendas</h1>
          <p class="page-subtitle">{{ facade.sales().length }} venda(s) registrada(s)</p>
        </div>
        <a routerLink="/sales/new" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          Nova Venda
        </a>
      </div>

      <div class="card animate-in animate-in-delay-1">
        @if (facade.sales().length === 0) {
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <p>Nenhuma venda registrada</p>
            <a routerLink="/sales/new" class="btn btn-outline btn-sm">Registrar venda</a>
          </div>
        } @else {
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Pagamento</th>
                  <th>Desconto</th>
                  <th>Total</th>
                  <th>Vendedor</th>
                </tr>
              </thead>
              <tbody>
                @for (sale of facade.sales(); track sale.id) {
                  <tr>
                    <td class="date-cell">{{ formatDate(sale.createdAt) }}</td>
                    <td><strong>{{ sale.customerName || '—' }}</strong></td>
                    <td>
                      <span class="badge badge-purple">{{ sale.items.length }} item(s)</span>
                    </td>
                    <td>{{ paymentLabel(sale.paymentMethod) }}</td>
                    <td>
                      @if (sale.discount > 0) {
                        <span class="badge badge-warning">- R$ {{ sale.discount.toFixed(2) }}</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                    <td><strong class="price">{{ formatCurrency(sale.total) }}</strong></td>
                    <td class="text-muted">{{ sale.sellerName }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      @if (facade.sales().length > 0) {
        <div class="summary-row animate-in animate-in-delay-2">
          <div class="summary-card">
            <div class="summary-icon summary-icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <div>
              <div class="summary-label">Total</div>
              <div class="summary-value">{{ formatCurrency(totalRevenue()) }}</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon summary-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16l3-1.5L9 20l2-1.5L13 20l2-1.5L17 20l2-1.5V8z"/><path d="M10 9h4M10 13h4M10 17h2"/></svg>
            </div>
            <div>
              <div class="summary-label">Nº de Vendas</div>
              <div class="summary-value">{{ facade.sales().length }}</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon summary-icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
              <div class="summary-label">Ticket Médio</div>
              <div class="summary-value">{{ formatCurrency(avgTicket()) }}</div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .date-cell { font-size: 0.82rem; color: var(--color-text-muted); white-space: nowrap; }
    .price { color: var(--color-primary-dark); }

    .summary-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 16px;
    }
    .summary-card {
      background: var(--color-bg-card);
      border-radius: 14px;
      border: 1px solid #EAD8F8;
      padding: 16px 20px;
      display: flex; align-items: center; gap: 14px;
    }
    .summary-icon {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .summary-icon-purple { background: #F3E8FF; color: #7B2D8B; }
    .summary-icon-blue   { background: #E8F0FF; color: #2856A8; }
    .summary-icon-green  { background: #E8F5E9; color: #2E7D32; }
    .summary-label {
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--color-text-muted); margin-bottom: 3px;
    }
    .summary-value {
      font-family: var(--font-display); font-size: 1.3rem; font-weight: 700;
      color: var(--color-primary-dark);
    }
    @media (max-width: 768px) {
      .summary-row { grid-template-columns: 1fr; }
    }
  `],
})
export class SalesListPageComponent implements OnInit {
  protected readonly facade = inject(SalesFacade);

  totalRevenue = computed(() => this.facade.sales().reduce((sum, s) => sum + s.total, 0));
  avgTicket    = computed(() => {
    const count = this.facade.sales().length;
    return count > 0 ? this.totalRevenue() / count : 0;
  });

  ngOnInit(): void { this.facade.loadAll(); }

  paymentLabel(m: string): string { return PAYMENT_LABELS[m as keyof typeof PAYMENT_LABELS] ?? m; }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  formatCurrency(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
