import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { ProductsFacade } from '../../facades/products.facade';
import { ToastService } from '../../../../core/services/toast.service';
import { ProductCategory, ProductForm } from '../../../../shared/models/product.model';

interface CsvRow { name: string; code: string; category: string; price: string; cost: string; stock: string; description: string; }
type ColIndex = Record<keyof CsvRow, number>;

const VALID_CATEGORIES: ProductCategory[] = ['feminino', 'masculino', 'infantil', 'acessorios', 'diversos'];
const normalizeCategory = (s: string): ProductCategory => {
  const lower = s.toLowerCase().trim();
  return VALID_CATEGORIES.includes(lower as ProductCategory) ? lower as ProductCategory : 'diversos';
};

type ImportPhase = 'idle' | 'preview' | 'importing' | 'done';

// Mapeamento de cabeçalhos do XLSX para campos internos
const HEADER_MAP: Record<string, keyof CsvRow> = {
  // nome
  'descrição do produto': 'name',
  'descricao do produto': 'name',
  'nome':                 'name',
  'name':                 'name',
  // código
  'código interno':       'code',
  'codigo interno':       'code',
  'código':               'code',
  'codigo':               'code',
  'code':                 'code',
  // categoria
  'categoria':            'category',
  'category':             'category',
  // preço de venda
  'valor venda':          'price',
  'valor de venda':       'price',
  'preço':                'price',
  'preco':                'price',
  'price':                'price',
  // custo
  'custo':                'cost',
  'valor custo':          'cost',
  'valor de custo':       'cost',
  'cost':                 'cost',
  // estoque
  'quantidade em estoque': 'stock',
  'estoque':               'stock',
  'stock':                 'stock',
  'quantidade':            'stock',
  // descrição
  'descrição':              'description',
  'descricao':              'description',
  'informação adicional':   'description',
  'informacao adicional':   'description',
  'description':            'description',
};

@Component({
  selector: 'app-import-products-page',
  imports: [RouterLink],
  templateUrl: './import-products-page.component.html',
})
export class ImportProductsPageComponent {
  private productsFacade = inject(ProductsFacade);
  private toast = inject(ToastService);

  phase         = signal<ImportPhase>('idle');
  dragging      = signal(false);
  fileName      = signal('');
  rows          = signal<CsvRow[]>([]);
  progress      = signal(0);
  importedCount = signal(0);

  errorCount = computed(() => this.rows().filter(r => this.hasRowError(r)).length);

  hasRowError(row: CsvRow): boolean {
    const price = parseFloat(row.price.replace(',', '.'));
    const stock = parseInt(row.stock);
    return !row.name || !row.code || isNaN(price) || price <= 0 || isNaN(stock);
  }

  getRowErrors(row: CsvRow): string {
    const errs: string[] = [];
    if (!row.name)  errs.push('Nome obrigatório');
    if (!row.code)  errs.push('Código obrigatório');
    const price = parseFloat(row.price.replace(',', '.'));
    if (isNaN(price) || price <= 0) errs.push('Preço inválido');
    if (isNaN(parseInt(row.stock))) errs.push('Estoque inválido');
    return errs.join(' · ');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const f = event.dataTransfer?.files[0];
    if (f) this.processFile(f);
  }

  onFileChange(event: Event): void {
    const f = (event.target as HTMLInputElement).files?.[0];
    if (f) this.processFile(f);
  }

  processFile(f: File): void {
    const isXlsx = f.name.endsWith('.xlsx');
    const isCsv  = f.name.endsWith('.csv');

    if (!isXlsx && !isCsv) {
      this.toast.error('Selecione um arquivo .csv ou .xlsx válido.');
      return;
    }

    this.fileName.set(f.name);
    isXlsx ? this.readXlsx(f) : this.readCsv(f);
  }

  private readCsv(f: File): void {
    const reader = new FileReader();
    reader.onload = (e) => this.parseCsvText(e.target?.result as string);
    reader.readAsText(f, 'utf-8');
  }

  private readXlsx(f: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb  = XLSX.read(e.target?.result as ArrayBuffer, { type: 'array' });
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
      this.parseCsvText(csv);
    };
    reader.readAsArrayBuffer(f);
  }

  private parseCsvText(text: string): void {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      this.toast.error('Arquivo vazio ou sem dados.');
      return;
    }

    const headers = this.splitCsvLine(lines[0]).map(h => h.toLowerCase().trim());
    const idx     = this.buildColumnIndex(headers);

    const parsed: CsvRow[] = lines.slice(1).map(line => {
      const cols = this.splitCsvLine(line);
      return {
        name:        idx.name        >= 0 ? (cols[idx.name]        ?? '') : '',
        code:        idx.code        >= 0 ? (cols[idx.code]        ?? '') : '',
        category:    idx.category    >= 0 ? (cols[idx.category]    ?? '') : '',
        price:       idx.price       >= 0 ? (cols[idx.price]       ?? '') : '',
        cost:        idx.cost        >= 0 ? (cols[idx.cost]        ?? '') : '',
        stock:       idx.stock       >= 0 ? (cols[idx.stock]       ?? '') : '',
        description: idx.description >= 0 ? (cols[idx.description] ?? '') : '',
      };
    });

    this.rows.set(parsed);
    this.phase.set('preview');
  }

  private splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { result.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    result.push(cur.trim());
    return result;
  }

  private buildColumnIndex(headers: string[]): ColIndex {
    const idx: ColIndex = { name: -1, code: -1, category: -1, price: -1, cost: -1, stock: -1, description: -1 };
    headers.forEach((h, i) => {
      const field = HEADER_MAP[h];
      if (field && idx[field] === -1) idx[field] = i;
    });
    return idx;
  }

  startImport(): void {
    const products: ProductForm[] = this.rows()
      .filter(r => !this.hasRowError(r))
      .map(r => {
        const cost  = parseFloat(r.cost.replace(',', '.'));
        const stock = parseInt(r.stock);
        return {
          name:        r.name,
          code:        r.code,
          category:    normalizeCategory(r.category),
          price:       parseFloat(r.price.replace(',', '.')),
          cost:        isNaN(cost)  ? 0 : cost,
          stock:       isNaN(stock) ? 0 : Math.max(0, stock),
          description: r.description || '',
        };
      });

    if (products.length === 0) return;
    this.phase.set('importing');
    this.progress.set(0);
    this.productsFacade.importProducts(
      products,
      (count: number) => {
        this.importedCount.set(count);
        this.progress.set(100);
        this.phase.set('done');
      },
      (done: number, total: number) => {
        this.importedCount.set(done);
        this.progress.set(Math.round((done / total) * 100));
      },
    );
  }

  reset(): void {
    this.phase.set('idle');
    this.rows.set([]);
    this.fileName.set('');
    this.progress.set(0);
    this.importedCount.set(0);
  }
}
