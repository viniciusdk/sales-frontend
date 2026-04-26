import { Injectable, inject, signal } from '@angular/core';
import { Product, ProductForm } from '../../../shared/models/product.model';
import { ProductsService } from '../services/products.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';

@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  private svc     = inject(ProductsService);
  private toast   = inject(ToastService);
  private loading = inject(LoadingService);

  readonly products  = signal<Product[]>([]);
  readonly selected  = signal<Product | null>(null);
  readonly submitting = signal(false);

  loadAll(): void {
    this.loading.show();
    this.svc.getAll().subscribe({
      next:     p => this.products.set(p),
      error:    () => this.toast.error('Erro ao carregar produtos.'),
      complete: () => this.loading.hide(),
    });
  }

  loadById(id: string): void {
    this.loading.show();
    this.svc.getById(id).subscribe({
      next:     p => this.selected.set(p ?? null),
      error:    () => this.toast.error('Produto não encontrado.'),
      complete: () => this.loading.hide(),
    });
  }

  create(form: ProductForm, onSuccess?: () => void): void {
    this.submitting.set(true);
    this.svc.create(form).subscribe({
      next: p => {
        this.products.update(list => [p, ...list]);
        this.toast.success('Produto cadastrado com sucesso!');
        onSuccess?.();
      },
      error:    () => this.toast.error('Erro ao cadastrar produto.'),
      complete: () => this.submitting.set(false),
    });
  }

  update(id: string, form: ProductForm, onSuccess?: () => void): void {
    this.submitting.set(true);
    this.svc.update(id, form).subscribe({
      next: p => {
        this.products.update(list => list.map(x => x.id === id ? p : x));
        this.toast.success('Produto atualizado com sucesso!');
        onSuccess?.();
      },
      error:    () => this.toast.error('Erro ao atualizar produto.'),
      complete: () => this.submitting.set(false),
    });
  }

  delete(id: string): void {
    this.loading.show();
    this.svc.delete(id).subscribe({
      next: () => {
        this.products.update(list => list.filter(p => p.id !== id));
        this.toast.success('Produto removido.');
      },
      error:    () => this.toast.error('Erro ao remover produto.'),
      complete: () => this.loading.hide(),
    });
  }
}
