import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsFacade } from '../../facades/products.facade';
import { ToastService } from '../../../../core/services/toast.service';

interface CsvRow { name: string; code: string; category: string; price: string; stock: string; description: string; }

type ImportPhase = 'idle' | 'preview' | 'importing' | 'done';

@Component({
  selector: 'app-import-products-page',
  imports: [RouterLink],
  template: `
    <div class="animate-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Importar Produtos</h1>
          <p class="page-subtitle">Importe produtos em massa a partir de um arquivo CSV</p>
        </div>
        <a routerLink="/products" class="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Voltar
        </a>
      </div>

      @if (phase() === 'done') {
        <div class="success-state animate-in">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="#2E7D32" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style="font-family: var(--font-display); color: var(--color-primary-dark); font-size: 1.6rem;">
            {{ rows().length }} produto(s) importado(s)!
          </h2>
          <p style="color: var(--color-text-muted);">Seus produtos foram adicionados ao catálogo com sucesso.</p>
          <div style="display: flex; gap: 12px; margin-top: 8px;">
            <a routerLink="/products" class="btn btn-primary">Ver Produtos</a>
            <button class="btn btn-ghost" (click)="reset()">Importar mais</button>
          </div>
        </div>
      } @else {
        <div class="import-layout">
          <!-- Left: upload + instructions -->
          <div class="section-card">
            <div class="section-card-header">Arquivo CSV</div>
            <div class="section-card-body">

              @if (phase() === 'idle' || phase() === 'preview') {
                <div
                  class="dropzone"
                  [class.dragging]="dragging()"
                  (dragover)="$event.preventDefault(); dragging.set(true)"
                  (dragleave)="dragging.set(false)"
                  (drop)="onDrop($event)"
                  (click)="fileInput.click()"
                >
                  <input #fileInput type="file" accept=".csv" style="display:none" (change)="onFileChange($event)"/>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="drop-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                  @if (fileName()) {
                    <p class="drop-title">{{ fileName() }}</p>
                    <p class="drop-sub">Clique para trocar o arquivo</p>
                  } @else {
                    <p class="drop-title">Arraste o arquivo CSV aqui</p>
                    <p class="drop-sub">ou clique para selecionar</p>
                  }
                </div>
              }

              <div class="template-box">
                <div class="template-title">Formato esperado (cabeçalho):</div>
                <code class="template-code">name,code,category,price,stock,description</code>
                <div class="template-hint">Categorias aceitas: <strong>feminino, masculino, infantil, acessorios</strong></div>
              </div>

            </div>
          </div>

          <!-- Right: preview / progress -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            @if (phase() === 'idle') {
              <div class="section-card">
                <div class="section-card-header">Pré-visualização</div>
                <div class="section-card-body">
                  <div class="empty-preview">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <p>Selecione um CSV para visualizar</p>
                  </div>
                </div>
              </div>
            }

            @if (phase() === 'preview') {
              <div class="section-card">
                <div class="section-card-header">
                  Pré-visualização — {{ rows().length }} linha(s)
                  @if (errorCount() > 0) {
                    <span class="badge badge-error" style="margin-left: 8px;">{{ errorCount() }} erro(s)</span>
                  }
                </div>
                <div class="section-card-body" style="padding: 0;">
                  <div class="preview-table-wrap">
                    <table class="preview-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nome</th>
                          <th>Código</th>
                          <th>Categoria</th>
                          <th>Preço</th>
                          <th>Estoque</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (row of rows(); track $index; let i = $index) {
                          <tr [class.row-error]="hasRowError(row)">
                            <td class="row-num">{{ i + 1 }}</td>
                            <td>{{ row.name || '—' }}</td>
                            <td><code>{{ row.code }}</code></td>
                            <td>{{ row.category }}</td>
                            <td>R$ {{ row.price }}</td>
                            <td>{{ row.stock }}</td>
                            <td>
                              @if (hasRowError(row)) {
                                <span class="row-err-icon" title="Linha com dados inválidos">!</span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 9px;">
                <button class="btn btn-primary btn-lg" style="width: 100%;" (click)="startImport()" [disabled]="rows().length === 0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  Importar {{ rows().length }} produto(s)
                </button>
                <button class="btn btn-ghost" style="width: 100%;" (click)="reset()">Cancelar</button>
              </div>
            }

            @if (phase() === 'importing') {
              <div class="section-card">
                <div class="section-card-header">Importando...</div>
                <div class="section-card-body" style="align-items: center; gap: 20px;">
                  <div class="import-progress-wrap">
                    <div class="progress-track">
                      <div class="progress-fill" [style.width.%]="progress()"></div>
                    </div>
                    <div class="progress-label">{{ progress() }}% — {{ importedCount() }} de {{ rows().length }}</div>
                  </div>
                  <div style="font-size: 0.82rem; color: var(--color-text-muted);">Por favor, aguarde...</div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .import-layout {
      display: grid;
      grid-template-columns: 380px 1fr;
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
      display: flex; align-items: center;
    }
    .section-card-body {
      padding: 20px;
      display: flex; flex-direction: column; gap: 14px;
    }

    /* Dropzone */
    .dropzone {
      border: 2px dashed #D8C0F0;
      border-radius: 12px;
      padding: 32px 20px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
    }
    .dropzone:hover, .dropzone.dragging {
      border-color: var(--color-primary);
      background: #F5EAFF;
    }
    .drop-icon { color: #B080C8; margin: 0 auto 12px; display: block; }
    .drop-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; color: var(--color-text); }
    .drop-sub { font-size: 0.78rem; color: var(--color-text-muted); }

    /* Template hint */
    .template-box {
      background: #F8F4FF;
      border-radius: 9px;
      padding: 12px 14px;
      border: 1px solid #EAD8F8;
    }
    .template-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: 6px; }
    .template-code { display: block; font-size: 0.75rem; color: #5C2878; background: #EEE0F8; padding: 6px 10px; border-radius: 6px; margin-bottom: 8px; word-break: break-all; }
    .template-hint { font-size: 0.74rem; color: var(--color-text-muted); }

    /* Empty preview */
    .empty-preview {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 10px; padding: 32px 20px; color: var(--color-text-muted); text-align: center;
    }
    .empty-preview p { font-size: 0.85rem; }

    /* Preview table */
    .preview-table-wrap { overflow-x: auto; max-height: 360px; overflow-y: auto; }
    .preview-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    .preview-table th {
      position: sticky; top: 0;
      background: #FBF5FF; padding: 8px 12px;
      text-align: left; font-size: 0.7rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
      color: var(--color-primary-dark); border-bottom: 1px solid #EAD8F8;
    }
    .preview-table td { padding: 7px 12px; border-bottom: 1px solid #F0E8F8; }
    .preview-table tbody tr:hover { background: #FBF5FF; }
    .row-error td { background: #FFF3F3 !important; }
    .row-num { color: var(--color-text-muted); font-size: 0.72rem; }
    .row-err-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 18px; height: 18px; border-radius: 50%; background: #FFEBEE;
      color: #C62828; font-weight: 800; font-size: 0.65rem;
    }
    code { font-size: 0.72rem; color: #5C2878; }

    /* Progress */
    .import-progress-wrap { width: 100%; }
    .progress-track {
      height: 10px; border-radius: 5px;
      background: #EAD8F8; overflow: hidden; margin-bottom: 8px;
    }
    .progress-fill {
      height: 100%; border-radius: 5px;
      background: linear-gradient(90deg, #7B2D8B, #B060C8);
      transition: width 0.25s ease;
    }
    .progress-label { font-size: 0.8rem; color: var(--color-text-muted); text-align: center; }

    /* Success */
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

    @media (max-width: 900px) {
      .import-layout { grid-template-columns: 1fr; }
    }
  `],
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
