import { Component, inject, OnInit, signal } from '@angular/core';
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
          <h1 class="page-title">{{ isEdit() ? 'Editar Produto' : 'Novo Produto' }}</h1>
          <p class="page-subtitle">{{ isEdit() ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar' }}</p>
        </div>
        <a routerLink="/products" class="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Voltar
        </a>
      </div>

      <div class="card animate-in animate-in-delay-1" style="padding: 32px; max-width: 680px; width: 100%;">
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-grid">
            <!-- Name -->
            <div class="form-group col-span-2">
              <label class="form-label" for="name">Nome do produto *</label>
              <input id="name" type="text" class="form-control" [class.error]="showError('name')"
                formControlName="name" placeholder="Ex: Blusa Floral Rosa" />
              @if (showError('name')) { <span class="form-error">Nome obrigatório</span> }
            </div>

            <!-- Code -->
            <div class="form-group">
              <label class="form-label" for="code">Código *</label>
              <input id="code" type="text" class="form-control" [class.error]="showError('code')"
                formControlName="code" placeholder="Ex: FEM001" style="text-transform: uppercase;" />
              @if (showError('code')) { <span class="form-error">Código obrigatório</span> }
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label" for="category">Categoria *</label>
              <select id="category" class="form-control" [class.error]="showError('category')" formControlName="category">
                <option value="">Selecione...</option>
                @for (entry of categoryEntries; track entry.key) {
                  <option [value]="entry.key">{{ entry.label }}</option>
                }
              </select>
              @if (showError('category')) { <span class="form-error">Categoria obrigatória</span> }
            </div>

            <!-- Price -->
            <div class="form-group">
              <label class="form-label" for="price">Preço (R$) *</label>
              <input id="price" type="number" class="form-control" [class.error]="showError('price')"
                formControlName="price" placeholder="0,00" min="0" step="0.01" />
              @if (showError('price')) { <span class="form-error">Preço inválido</span> }
            </div>

            <!-- Stock -->
            <div class="form-group">
              <label class="form-label" for="stock">Estoque *</label>
              <input id="stock" type="number" class="form-control" [class.error]="showError('stock')"
                formControlName="stock" placeholder="0" min="0" />
              @if (showError('stock')) { <span class="form-error">Estoque inválido</span> }
            </div>

            <!-- Description -->
            <div class="form-group col-span-2">
              <label class="form-label" for="description">Descrição</label>
              <textarea id="description" class="form-control" formControlName="description"
                placeholder="Descreva o produto..." rows="3"></textarea>
            </div>
          </div>

          <div class="divider"></div>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <a routerLink="/products" class="btn btn-outline">Cancelar</a>
            <button type="submit" class="btn btn-primary" [disabled]="facade.submitting()">
              @if (facade.submitting()) {
                <span class="btn-spinner"></span> Salvando...
              } @else {
                {{ isEdit() ? 'Atualizar' : 'Cadastrar' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .col-span-2 { grid-column: span 2; }
    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }
    textarea.form-control { resize: vertical; }
    @media (max-width: 540px) {
      .form-grid { grid-template-columns: 1fr; }
      .col-span-2 { grid-column: span 1; }
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

  categoryEntries = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label }));

  form = this.fb.group({
    name:        ['', Validators.required],
    code:        ['', Validators.required],
    category:    ['', Validators.required],
    price:       [0, [Validators.required, Validators.min(0.01)]],
    stock:       [0, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productId.set(id);
      this.facade.loadById(id);
      const checkSelected = setInterval(() => {
        const p = this.facade.selected();
        if (p) {
          this.form.patchValue(p);
          clearInterval(checkSelected);
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
      this.facade.create(val, () => this.router.navigate(['/products']));
    }
  }
}
