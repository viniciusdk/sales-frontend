import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsFacade } from '../../facades/products.facade';
import { CATEGORY_LABELS } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-products-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './products-form-page.component.html',
})
export class ProductsFormPageComponent implements OnInit {
  protected readonly facade = inject(ProductsFacade);
  private fb     = inject(FormBuilder);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit    = signal(false);
  submitted = signal(false);
  productId = signal<string | null>(null);
  saved     = signal(false);

  categoryEntries = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label }));

  form = this.fb.group({
    name:        ['', Validators.required],
    code:        ['', Validators.required],
    category:    ['', Validators.required],
    price:       [null as number | null, [Validators.required, Validators.min(0.01)]],
    costPrice:   [null as number | null],
    stock:       [null as number | null, [Validators.required, Validators.min(0)]],
    minStock:    [null as number | null],
    description: [''],
    supplier:    [''],
  });

  margin = computed<string | null>(() => {
    const price    = this.form.get('price')?.value;
    const cost     = this.form.get('costPrice')?.value;
    if (!price || !cost || +price <= 0) return null;
    return (((+price - +cost) / +price) * 100).toFixed(1);
  });

  marginClass(): string {
    const m = this.margin();
    if (m === null) return '';
    const v = parseFloat(m);
    if (v > 20) return 'margin-box margin-good';
    if (v > 10) return 'margin-box margin-warn';
    return 'margin-box margin-bad';
  }

  categoryLabel(key: string | null | undefined): string {
    return key ? (CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] ?? key) : '';
  }

  stockBadgeClass(stock: number): string {
    if (stock === 0) return 'badge badge-error';
    if (stock <= 5)  return 'badge badge-warning';
    return 'badge badge-success';
  }

  formatCurrency(v: number): string {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productId.set(id);
      this.facade.loadById(id);
      const check = setInterval(() => {
        const p = this.facade.selected();
        if (p) {
          this.form.patchValue(p);
          clearInterval(check);
        }
      }, 100);
    }
  }

  showError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted());
  }

  submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    const val = this.form.value as any;
    const id  = this.productId();
    if (id) {
      this.facade.update(id, val, () => this.router.navigate(['/products']));
    } else {
      this.facade.create(val, () => {
        this.saved.set(true);
        setTimeout(() => this.router.navigate(['/products']), 1300);
      });
    }
  }
}
