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
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Nova Venda</h1>
          <p class="page-subtitle">Adicione produtos e finalize a venda</p>
        </div>
      </div>

      <div class="sale-layout">
        <!-- Left: product selector -->
        <div class="sale-products animate-in animate-in-delay-1">
          <div class="card" style="padding: 24px;">
            <h3 class="section-title">Adicionar Produto</h3>

            <div class="product-search-box">
              <input
                type="search"
                class="form-control"
                placeholder="Buscar produto por nome ou código..."
                [value]="productSearch()"
                (input)="productSearch.set($any($event.target).value)"
              />
            </div>

            <div class="product-grid">
              @for (p of filteredProducts(); track p.id) {
                <div class="product-card-btn"
                  [class.out-of-stock]="p.stock === 0"
                  [class.in-cart]="cartQty(p.id) > 0"
                  (click)="addToCart(p)">
                  @if (cartQty(p.id) > 0) {
                    <div class="card-qty-badge">{{ cartQty(p.id) }}</div>
                  }
                  <div class="product-card-category">{{ p.category }}</div>
                  <div class="product-card-name">{{ p.name }}</div>
                  <div class="product-card-code">{{ p.code }}</div>
                  <div class="product-card-footer">
                    <strong class="product-card-price">{{ formatCurrency(p.price) }}</strong>
                    <span class="product-card-stock" [class.low]="p.stock <= 5">{{ p.stock }} un.</span>
                  </div>
                </div>
              }
              @if (filteredProducts().length === 0) {
                <p class="text-muted" style="padding: 12px 0; font-size: 0.875rem;">Nenhum produto encontrado.</p>
              }
            </div>
          </div>
        </div>

        <!-- Right: cart + checkout -->
        <div class="sale-cart animate-in animate-in-delay-2">
          <div class="card" style="padding: 24px;">
            <h3 class="section-title">
              Carrinho
              @if (cart().length > 0) {
                <span class="badge badge-purple" style="margin-left: 8px;">{{ cart().length }}</span>
              }
            </h3>

            @if (cart().length === 0) {
              <div class="empty-state" style="padding: 32px 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.4A1 1 0 007 20h10M10 20a1 1 0 102 0M17 20a1 1 0 102 0"/></svg>
                <p style="font-size: 0.875rem;">Clique em um produto para adicionar</p>
              </div>
            } @else {
              <div class="cart-items">
                @for (item of cart(); track item.product.id) {
                  <div class="cart-item">
                    <div class="cart-item-info">
                      <span class="cart-item-name">{{ item.product.name }}</span>
                      <span class="cart-item-price">{{ formatCurrency(item.product.price) }} un.</span>
                    </div>
                    <div class="cart-item-controls">
                      <button class="qty-btn" (click)="decreaseQty(item.product.id)" aria-label="Diminuir">−</button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button class="qty-btn" (click)="increaseQty(item.product.id)" [disabled]="item.quantity >= item.product.stock" aria-label="Aumentar">+</button>
                      <span class="cart-item-subtotal">{{ formatCurrency(item.subtotal) }}</span>
                      <button class="btn btn-ghost btn-sm btn-icon" (click)="removeFromCart(item.product.id)" aria-label="Remover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color: var(--color-error)"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                }
              </div>

              <div class="divider"></div>

              <!-- Checkout form -->
              <form [formGroup]="form" (ngSubmit)="submit()" novalidate style="margin-top: 16px;">
                <div class="form-group">
                  <label class="form-label" for="customerName">Nome do cliente</label>
                  <input id="customerName" type="text" class="form-control" formControlName="customerName" placeholder="Nome do cliente" />
                </div>

                <div class="form-row" style="margin-top: 14px;">
                  <div class="form-group">
                    <label class="form-label" for="payment">Pagamento *</label>
                    <select id="payment" class="form-control" [class.error]="showError('paymentMethod')" formControlName="paymentMethod">
                      <option value="">Selecione...</option>
                      @for (entry of paymentEntries; track entry.key) {
                        <option [value]="entry.key">{{ entry.label }}</option>
                      }
                    </select>
                    @if (showError('paymentMethod')) { <span class="form-error">Selecione a forma de pagamento</span> }
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="discount">Desconto (R$)</label>
                    <input id="discount" type="number" class="form-control" formControlName="discount" placeholder="0" min="0" step="0.01" />
                  </div>
                </div>

                <div class="total-box">
                  <div class="total-row">
                    <span>Subtotal</span>
                    <span>{{ formatCurrency(subtotal()) }}</span>
                  </div>
                  @if (discount() > 0) {
                    <div class="total-row discount-row">
                      <span>Desconto</span>
                      <span>− {{ formatCurrency(discount()) }}</span>
                    </div>
                  }
                  <div class="total-row total-final">
                    <span>Total</span>
                    <strong>{{ formatCurrency(totalFinal()) }}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  style="width: 100%; margin-top: 16px;"
                  [disabled]="salesFacade.submitting() || cart().length === 0"
                >
                  @if (salesFacade.submitting()) {
                    <span class="btn-spinner"></span> Finalizando...
                  } @else {
                    Finalizar Venda
                  }
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sale-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
      align-items: start;
    }

    .section-title {
      font-family: var(--font-display);
      font-size: 1.1rem;
      color: var(--color-primary-dark);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
    }

    .product-search-box { margin-bottom: 16px; }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
      max-height: 420px;
      overflow-y: auto;
      padding-right: 4px;
    }

    .product-card-btn {
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 12px;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s, background 0.15s;
      background: var(--color-bg-card);
      position: relative;
    }
    .product-card-btn:hover:not(.out-of-stock) {
      border-color: var(--color-primary-light);
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
    }
    .product-card-btn.in-cart {
      border-color: #9B4DB3;
      background: #FBF0FE;
    }
    .product-card-btn.out-of-stock { opacity: 0.45; cursor: not-allowed; }

    .card-qty-badge {
      position: absolute; top: 7px; right: 7px;
      width: 17px; height: 17px; border-radius: 50%;
      background: #7B2D8B; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.58rem; font-weight: 800;
      line-height: 1; pointer-events: none;
    }

    .product-card-category {
      font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em;
      color: var(--color-primary); font-weight: 700; margin-bottom: 4px;
    }
    .product-card-name { font-size: 0.83rem; font-weight: 600; line-height: 1.3; margin-bottom: 3px; }
    .product-card-code  { font-size: 0.72rem; color: var(--color-text-muted); font-family: monospace; margin-bottom: 8px; }
    .product-card-footer { display: flex; justify-content: space-between; align-items: center; }
    .product-card-price  { font-size: 0.85rem; color: var(--color-primary-dark); }
    .product-card-stock  { font-size: 0.72rem; color: var(--color-text-muted); }
    .product-card-stock.low { color: var(--color-warning); font-weight: 600; }

    .cart-items { display: flex; flex-direction: column; gap: 10px; }

    .cart-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 12px; background: var(--color-accent-light);
      border-radius: var(--radius-sm); gap: 12px; flex-wrap: wrap;
    }
    .cart-item-info { flex: 1; min-width: 0; }
    .cart-item-name  { display: block; font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cart-item-price { display: block; font-size: 0.75rem; color: var(--color-text-muted); }

    .cart-item-controls { display: flex; align-items: center; gap: 6px; }
    .qty-btn {
      width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid var(--color-border);
      background: var(--color-bg-card); cursor: pointer; font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
      color: var(--color-primary); font-weight: 700;
      transition: background 0.15s;
    }
    .qty-btn:hover:not(:disabled) { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
    .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .qty-value { min-width: 24px; text-align: center; font-weight: 600; font-size: 0.875rem; }
    .cart-item-subtotal { font-size: 0.85rem; font-weight: 700; color: var(--color-primary-dark); min-width: 64px; text-align: right; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .total-box {
      background: var(--color-accent-light);
      border-radius: var(--radius-sm);
      padding: 14px 16px;
      margin-top: 16px;
      display: flex; flex-direction: column; gap: 6px;
    }
    .total-row { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--color-text-muted); }
    .discount-row { color: var(--color-warning); }
    .total-final { font-size: 1.05rem; color: var(--color-text); padding-top: 6px; border-top: 1px solid var(--color-border); margin-top: 4px; }
    .total-final strong { color: var(--color-primary-dark); font-size: 1.2rem; }

    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    @media (max-width: 900px) {
      .sale-layout { grid-template-columns: 1fr; }
      .sale-cart { order: -1; }
    }
  `],
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
