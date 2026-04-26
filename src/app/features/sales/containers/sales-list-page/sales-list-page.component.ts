import { Component, inject, OnInit } from '@angular/core';
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
    </div>
  `,
  styles: [`
    .date-cell { font-size: 0.82rem; color: var(--color-text-muted); white-space: nowrap; }
    .price { color: var(--color-primary-dark); }
  `],
})
export class SalesListPageComponent implements OnInit {
  protected readonly facade = inject(SalesFacade);

  ngOnInit(): void { this.facade.loadAll(); }

  paymentLabel(m: string): string { return PAYMENT_LABELS[m as keyof typeof PAYMENT_LABELS] ?? m; }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  formatCurrency(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
