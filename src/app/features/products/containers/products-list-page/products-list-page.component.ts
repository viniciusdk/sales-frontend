import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductsFacade } from '../../facades/products.facade';
import { CATEGORY_LABELS, ProductCategory } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-products-list-page',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './products-list-page.component.html',
})
export class ProductsListPageComponent implements OnInit {
  protected readonly facade = inject(ProductsFacade);

  search         = signal('');
  categoryFilter = signal('');
  deleteTarget   = signal<{ id: string; name: string } | null>(null);

  categoryEntries = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label }));

  filtered = computed(() => {
    const q   = this.search().toLowerCase();
    const cat = this.categoryFilter() as ProductCategory | '';
    return this.facade.products().filter(p => {
      const matchQ   = !q   || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      const matchCat = !cat || p.category === cat;
      return matchQ && matchCat;
    });
  });

  ngOnInit(): void { this.facade.loadAll(); }

  categoryLabel(cat: ProductCategory): string { return CATEGORY_LABELS[cat]; }

  stockBadge(stock: number): string {
    if (stock === 0) return 'badge badge-error';
    if (stock <= 5)  return 'badge badge-warning';
    return 'badge badge-success';
  }

  confirmDelete(id: string, name: string): void { this.deleteTarget.set({ id, name }); }

  deleteConfirmed(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.facade.delete(target.id);
    this.deleteTarget.set(null);
  }
}
