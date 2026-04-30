import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsFacade } from '../../facades/products.facade';
import { CATEGORY_LABELS } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-products-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="animate-in">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ isEdit() ? 'Editar Produto' : 'Cadastrar Produto' }}</h1>
          <p class="page-subtitle">{{ isEdit() ? 'Atualize as informações do produto' : 'Preencha as informações do novo produto' }}</p>
        </div>
      </div>

      @if (saved()) {
        <div class="success-state animate-in">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="#2E7D32" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style="font-family: var(--font-display); color: var(--color-primary-dark); font-size: 1.6rem;">Produto salvo!</h2>
          <p style="color: var(--color-text-muted);">Redirecionando...</p>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-cols">

            <!-- Col 1: Informações básicas -->
            <div class="section-card">
              <div class="section-card-header">Informações Básicas</div>
              <div class="section-card-body">
                <div class="form-group">
                  <label class="form-label" for="name">Nome do produto <span class="req">*</span></label>
                  <input id="name" type="text" class="form-control" [class.error]="showError('name')"
                    formControlName="name" placeholder="Ex: Blusa Floral Verão"/>
                  @if (showError('name')) { <span class="form-error">Campo obrigatório</span> }
                </div>

                <div class="fg-2col">
                  <div class="form-group">
                    <label class="form-label" for="code">Código <span class="req">*</span></label>
                    <input id="code" type="text" class="form-control" [class.error]="showError('code')"
                      formControlName="code" placeholder="VLD-000" style="text-transform: uppercase;"/>
                    @if (showError('code')) { <span class="form-error">Obrigatório</span> }
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="category">Categoria <span class="req">*</span></label>
                    <select id="category" class="form-control" [class.error]="showError('category')" formControlName="category">
                      <option value="">Selecione...</option>
                      @for (entry of categoryEntries; track entry.key) {
                        <option [value]="entry.key">{{ entry.label }}</option>
                      }
                    </select>
                    @if (showError('category')) { <span class="form-error">Obrigatório</span> }
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="description">Descrição</label>
                  <textarea id="description" class="form-control" formControlName="description"
                    placeholder="Descrição detalhada do produto..." rows="3" style="resize: vertical;"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label" for="supplier">Fornecedor</label>
                  <input id="supplier" type="text" class="form-control" formControlName="supplier"
                    placeholder="Nome do fornecedor"/>
                </div>
              </div>
            </div>

            <!-- Col 2: Preço & Estoque -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div class="section-card">
                <div class="section-card-header">Preço &amp; Margem</div>
                <div class="section-card-body">
                  <div class="form-group">
                    <label class="form-label" for="price">Preço de venda (R$) <span class="req">*</span></label>
                    <input id="price" type="number" class="form-control" [class.error]="showError('price')"
                      formControlName="price" placeholder="0,00" min="0" step="0.01"/>
                    @if (showError('price')) { <span class="form-error">Preço inválido</span> }
                  </div>

                  <div class="form-group" style="margin-top: 13px;">
                    <label class="form-label" for="costPrice">Preço de custo (R$)</label>
                    <input id="costPrice" type="number" class="form-control" formControlName="costPrice"
                      placeholder="0,00" min="0" step="0.01"/>
                  </div>

                  @if (margin() !== null) {
                    <div class="margin-box" [class]="marginClass()">
                      <div class="margin-label">Margem de lucro</div>
                      <div class="margin-value">{{ margin() }}%</div>
                    </div>
                  }
                </div>
              </div>

              <div class="section-card">
                <div class="section-card-header">Estoque</div>
                <div class="section-card-body">
                  <div class="fg-2col">
                    <div class="form-group">
                      <label class="form-label" for="stock">Estoque atual <span class="req">*</span></label>
                      <input id="stock" type="number" class="form-control" [class.error]="showError('stock')"
                        formControlName="stock" placeholder="0" min="0" step="1"/>
                      @if (showError('stock')) { <span class="form-error">Obrigatório</span> }
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="minStock">Estoque mínimo</label>
                      <input id="minStock" type="number" class="form-control" formControlName="minStock"
                        placeholder="0" min="0" step="1"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Col 3: Preview -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div class="section-card">
                <div class="section-card-header">Pré-visualização</div>
                <div class="section-card-body">
                  <div class="preview-card">
                    @if (form.value.name) {
                      <div class="preview-name">{{ form.value.name }}</div>
                    } @else {
                      <div class="preview-placeholder">Nome do produto</div>
                    }
                    @if (form.value.code) {
                      <div class="preview-code">{{ form.value.code }}</div>
                    }
                    @if (form.value.category) {
                      <span class="badge badge-purple">{{ categoryLabel(form.value.category) }}</span>
                    }
                    @if (form.value.price && +form.value.price > 0) {
                      <div class="preview-price">{{ formatCurrency(+form.value.price) }}</div>
                    }
                    @if (form.value.stock !== null && form.value.stock !== undefined) {
                      <div style="margin-top: 8px;">
                        <span class="badge" [class]="stockBadgeClass(+form.value.stock!)">
                          {{ form.value.stock }} un. em estoque
                        </span>
                      </div>
                    }
                  </div>
                  @if (form.value.description) {
                    <p class="preview-desc">{{ form.value.description }}</p>
                  }
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 9px;">
                <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" [disabled]="facade.submitting()">
                  @if (facade.submitting()) {
                    <span class="btn-spinner"></span> Salvando...
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ isEdit() ? 'Atualizar Produto' : 'Salvar Produto' }}
                  }
                </button>
                <a routerLink="/products" class="btn btn-ghost" style="width: 100%; justify-content: center;">Cancelar</a>
              </div>
            </div>

          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .form-cols {
      display: grid;
      grid-template-columns: 1fr 1fr 300px;
      gap: 18px;
      align-items: start;
    }

    .section-card {
      background: var(--color-bg-card);
      border-radius: 14px;
      border: 1px solid #EAD8F8;
      overflow: hidden;
    }
    .section-card-header {
      padding: 14px 20px;
      border-bottom: 1px solid #F0E8F8;
      background: #FBF5FF;
      font-family: var(--font-display);
      font-size: 0.95rem; font-weight: 700;
      color: var(--color-primary-dark);
    }
    .section-card-body {
      padding: 20px;
      display: flex; flex-direction: column; gap: 13px;
    }

    .fg-2col {
      display: grid; grid-template-columns: 1fr 1fr; gap: 11px;
    }

    .req { color: var(--color-error); margin-left: 2px; }

    /* Margin calculator */
    .margin-box {
      padding: 10px 14px; border-radius: 9px; margin-top: 4px;
    }
    .margin-box.margin-good   { background: #E8F5E9; border: 1px solid #C8E6CA; }
    .margin-box.margin-warn   { background: #FFF3E0; border: 1px solid #FFE0B2; }
    .margin-box.margin-bad    { background: #FFEBEE; border: 1px solid #FFCDD2; }
    .margin-label {
      font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.05em; color: #555; margin-bottom: 3px;
    }
    .margin-value {
      font-family: var(--font-display); font-size: 1.4rem; font-weight: 700;
    }
    .margin-good .margin-value { color: #2E7D32; }
    .margin-warn .margin-value { color: #E65100; }
    .margin-bad  .margin-value { color: #C62828; }

    /* Preview card */
    .preview-card {
      background: linear-gradient(135deg, #F5EAFF, #EDD5F8);
      border-radius: 12px; padding: 16px; margin-bottom: 14px;
      border: 1px solid #D8C0F0;
      min-height: 100px;
    }
    .preview-name { font-size: 0.95rem; font-weight: 700; color: var(--color-text); margin-bottom: 4px; }
    .preview-placeholder { font-size: 0.85rem; color: #B0A0C0; font-style: italic; }
    .preview-code { font-family: monospace; font-size: 0.72rem; color: #7B5588; margin-bottom: 8px; }
    .preview-price {
      font-family: var(--font-display); font-size: 1.4rem; font-weight: 700;
      color: var(--color-primary-dark); margin-top: 12px;
    }
    .preview-desc { font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.6; margin: 0; }

    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    /* Success state */
    .success-state {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      height: 65vh; gap: 16px; text-align: center;
    }
    .success-icon {
      width: 70px; height: 70px; border-radius: 50%;
      background: #E8F5E9;
      display: flex; align-items: center; justify-content: center;
    }

    textarea.form-control { resize: vertical; }

    @media (max-width: 1200px) {
      .form-cols { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .form-cols { grid-template-columns: 1fr; }
      .fg-2col   { grid-template-columns: 1fr; }
    }
  `],
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
