import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SalesFacade } from '../../facades/sales.facade';
import { ProductsFacade } from '../../../products/facades/products.facade';
import { PAYMENT_LABELS, PaymentMethod, SaleItem } from '../../../../shared/models/sale.model';
import { Product } from '../../../../shared/models/product.model';

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-sales-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sales-page.component.html',
})
export class SalesPageComponent implements OnInit {
  protected readonly salesFacade    = inject(SalesFacade);
  protected readonly productsFacade = inject(ProductsFacade);
  private fb     = inject(FormBuilder);
  private router = inject(Router);

  cart          = signal<CartItem[]>([]);
  productSearch = signal('');
  submitted     = signal(false);

  paymentEntries = Object.entries(PAYMENT_LABELS).map(([key, label]) => ({ key, label }));

  form = this.fb.group({
    customerName:  [''],
    paymentMethod: ['', Validators.required],
    discount:      [0, [Validators.min(0)]],
  });

  filteredProducts = computed(() => {
    const q = this.productSearch().toLowerCase();
    return this.productsFacade.products().filter(p =>
      !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
  });

  subtotal  = computed(() => this.cart().reduce((a, i) => a + i.subtotal, 0));
  discount  = computed(() => Math.min(Number(this.form.get('discount')?.value ?? 0), this.subtotal()));
  totalFinal = computed(() => Math.max(0, this.subtotal() - this.discount()));

  ngOnInit(): void { this.productsFacade.loadAll(); }

  addToCart(product: Product): void {
    if (product.stock === 0) return;
    this.cart.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return items;
        return items.map(i => i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * product.price }
          : i
        );
      }
      return [...items, { product, quantity: 1, subtotal: product.price }];
    });
  }

  increaseQty(id: string): void {
    this.cart.update(items => items.map(i => {
      if (i.product.id !== id) return i;
      const q = Math.min(i.quantity + 1, i.product.stock);
      return { ...i, quantity: q, subtotal: q * i.product.price };
    }));
  }

  decreaseQty(id: string): void {
    this.cart.update(items => {
      const updated = items.map(i => {
        if (i.product.id !== id) return i;
        const q = i.quantity - 1;
        return q > 0 ? { ...i, quantity: q, subtotal: q * i.product.price } : null;
      }).filter(Boolean) as CartItem[];
      return updated;
    });
  }

  removeFromCart(id: string): void {
    this.cart.update(items => items.filter(i => i.product.id !== id));
  }

  showError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted());
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.cart().length === 0) return;

    const val = this.form.value;
    const saleItems: Omit<SaleItem, 'subtotal'>[] = this.cart().map(i => ({
      productId:   i.product.id,
      productName: i.product.name,
      productCode: i.product.code,
      quantity:    i.quantity,
      unitPrice:   i.product.price,
    }));

    this.salesFacade.create(
      {
        items:         saleItems,
        paymentMethod: val.paymentMethod as PaymentMethod,
        discount:      Number(val.discount) || 0,
        customerName:  val.customerName || '',
      },
      () => this.router.navigate(['/sales'])
    );
  }

  cartQty(productId: string): number {
    return this.cart().find(i => i.product.id === productId)?.quantity ?? 0;
  }

  formatCurrency(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
