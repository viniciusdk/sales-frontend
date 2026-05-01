import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsFacade } from '../../facades/products.facade';
import { ToastService } from '../../../../core/services/toast.service';

interface CsvRow { name: string; code: string; category: string; price: string; stock: string; description: string; }

type ImportPhase = 'idle' | 'preview' | 'importing' | 'done';

@Component({
  selector: 'app-import-products-page',
  imports: [RouterLink],
  templateUrl: './import-products-page.component.html',
})
export class ImportProductsPageComponent {
  private productsFacade = inject(ProductsFacade);
  private toast = inject(ToastService);

  phase        = signal<ImportPhase>('idle');
  dragging     = signal(false);
  fileName     = signal('');
  rows         = signal<CsvRow[]>([]);
  progress     = signal(0);
  importedCount = signal(0);

  errorCount = computed(() => this.rows().filter(r => this.hasRowError(r)).length);

  hasRowError(row: CsvRow): boolean {
    return !row.name || !row.code || isNaN(parseFloat(row.price)) || isNaN(parseInt(row.stock));
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  processFile(file: File): void {
    if (!file.name.endsWith('.csv')) {
      this.toast.error('Selecione um arquivo .csv válido.');
      return;
    }
    this.fileName.set(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.parseCsv(text);
    };
    reader.readAsText(file, 'utf-8');
  }

  parseCsv(text: string): void {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      this.toast.error('Arquivo vazio ou sem dados.');
      return;
    }
    const parsed: CsvRow[] = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      return {
        name:        cols[0] ?? '',
        code:        cols[1] ?? '',
        category:    cols[2] ?? '',
        price:       cols[3] ?? '',
        stock:       cols[4] ?? '',
        description: cols[5] ?? '',
      };
    });
    this.rows.set(parsed);
    this.phase.set('preview');
  }

  startImport(): void {
    this.phase.set('importing');
    this.progress.set(0);
    this.importedCount.set(0);

    const validRows = this.rows().filter(r => !this.hasRowError(r));
    let idx = 0;

    const tick = () => {
      if (idx >= validRows.length) {
        this.progress.set(100);
        setTimeout(() => this.phase.set('done'), 400);
        return;
      }
      const row = validRows[idx];
      this.productsFacade.create({
        name:        row.name,
        code:        row.code.toUpperCase(),
        category:    row.category as any,
        price:       parseFloat(row.price),
        stock:       parseInt(row.stock),
        description: row.description,
      });
      idx++;
      this.importedCount.set(idx);
      this.progress.set(Math.round((idx / validRows.length) * 100));
      setTimeout(tick, 120);
    };

    setTimeout(tick, 200);
  }

  reset(): void {
    this.phase.set('idle');
    this.rows.set([]);
    this.fileName.set('');
    this.progress.set(0);
    this.importedCount.set(0);
  }
}
