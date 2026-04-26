import { Injectable, inject, signal } from '@angular/core';
import { Sale, SaleForm } from '../../../shared/models/sale.model';
import { SalesService } from '../services/sales.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';

@Injectable({ providedIn: 'root' })
export class SalesFacade {
  private svc     = inject(SalesService);
  private toast   = inject(ToastService);
  private loading = inject(LoadingService);

  readonly sales      = signal<Sale[]>([]);
  readonly submitting = signal(false);

  loadAll(): void {
    this.loading.show();
    this.svc.getAll().subscribe({
      next:     s => this.sales.set(s),
      error:    () => this.toast.error('Erro ao carregar vendas.'),
      complete: () => this.loading.hide(),
    });
  }

  create(form: SaleForm, onSuccess?: (sale: Sale) => void): void {
    this.submitting.set(true);
    this.svc.create(form).subscribe({
      next: s => {
        this.sales.update(list => [s, ...list]);
        this.toast.success('Venda registrada com sucesso!');
        onSuccess?.(s);
      },
      error:    () => this.toast.error('Erro ao registrar venda.'),
      complete: () => this.submitting.set(false),
    });
  }
}
