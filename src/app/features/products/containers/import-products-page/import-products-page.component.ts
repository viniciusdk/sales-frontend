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

  phase         = signal<ImportPhase>('idle');
  dragging      = signal(false);
  fileName      = signal('');
  rows          = signal<CsvRow[]>([]);
  progress      = signal(0);
  importedCount = signal(0);

  private file = signal<File | null>(null);

  errorCount = computed(() => this.rows().filter(r => this.hasRowError(r)).length);

  hasRowError(row: CsvRow): boolean {
    return !row.name || !row.code || isNaN(parseFloat(row.price)) || isNaN(parseInt(row.stock));
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
    if (!f.name.endsWith('.csv')) {
      this.toast.error('Selecione um arquivo .csv válido.');
      return;
    }
    this.file.set(f);
    this.fileName.set(f.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.parseCsv(text);
    };
    reader.readAsText(f, 'utf-8');
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
    const f = this.file();
    if (!f) return;
    this.phase.set('importing');
    this.progress.set(50);
    this.productsFacade.importCsv(f, (count) => {
      this.importedCount.set(count);
      this.progress.set(100);
      this.phase.set('done');
    });
  }

  reset(): void {
    this.phase.set('idle');
    this.rows.set([]);
    this.fileName.set('');
    this.progress.set(0);
    this.importedCount.set(0);
    this.file.set(null);
  }
}
