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

  readonly products   = signal<Product[]>([]);
  readonly selected   = signal<Product | null>(null);
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
    this.svc.getAll().subscribe({
      next: products => {
        this.products.set(products);
        this.selected.set(products.find(p => p.id === id) ?? null);
      },
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

  importProducts(
    products: ProductForm[],
    onSuccess?: (count: number) => void,
    onProgress?: (done: number, total: number) => void,
  ): void {
    const CHUNK_SIZE = 100;
    const chunks: ProductForm[][] = [];
    for (let i = 0; i < products.length; i += CHUNK_SIZE) {
      chunks.push(products.slice(i, i + CHUNK_SIZE));
    }

    let imported = 0;
    this.loading.show();

    const sendChunk = (index: number): void => {
      if (index >= chunks.length) {
        this.toast.success(`${imported} produto(s) importado(s) com sucesso!`);
        onSuccess?.(imported);
        this.loading.hide();
        this.loadAll();
        return;
      }

      this.svc.importProducts(chunks[index]).subscribe({
        next: res => {
          imported += res.success;
          if (res.errors?.length) {
            res.errors.forEach(e => this.toast.error(`Linha ${e.row + (index * CHUNK_SIZE)}: ${e.message}`));
          }
          onProgress?.(imported, products.length);
          sendChunk(index + 1);
        },
        error: () => {
          this.toast.error('Erro ao importar produtos.');
          this.loading.hide();
        },
      });
    };

    sendChunk(0);
  }
}
