import { Component, inject, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SalesFacade } from '../../facades/sales.facade';
import { PAYMENT_LABELS } from '../../../../shared/models/sale.model';

@Component({
  selector: 'app-sales-list-page',
  imports: [RouterLink],
  templateUrl: './sales-list-page.component.html',
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
